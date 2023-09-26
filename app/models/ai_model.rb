class AiModel < ApplicationRecord
  belongs_to :user

  def book_titles
    books = user.lists.find_by(type: "Books")
    if books
      items = books.items.pluck(:title, :creator)
      items.map { |item| "#{item[0]} by #{item[1]}" }.join(', ')
    end
  end

  def has_books?
    book_titles.present?
  end

  def podcast_titles
    podcasts = user.lists.find_by(type: "Podcasts")
    if podcasts
      items = podcasts.items.pluck(:title, :creator)
      items.map { |item| "#{item[0]} by #{item[1]}" }.join(', ')
    end
  end

  def has_podcasts?
    podcast_titles.present?
  end

  def get_book_recommendations
    begin
      response = client.chat(
          parameters: {
              model: "gpt-4",
              messages: [{ role: "user", content: "I like the following books: #{book_titles}. Can you recommend 5 more REAL books for me based on the books I like. Sort the results from most to least compatible. And structure the response as a JSON object formatted like: '{ 'books': { 'title': 'Book Title Example', 'creator': 'Author Example' } }'?"}],
              temperature: 0.7,
          }
      )
      res = JSON.parse(response)
      res["books"]
    rescue => e
      ap e
      get_book_recommendations
    end
  end

  def get_podcast_recommendations
    prompt = "I like the following podcast episodes: #{podcast_titles}. Can you recommend 5 more REAL PODCAST EPISODES from Apple Podcasts (not audiobooks) for me based on the episodes I like. Sort the results from most to least compatible. And structure the response as a JSON object I can parse. Here is an example: '{ 'podcasts': { 'title': 'Episode Title', 'creator': 'Podcast Title' } }'"
    response = completion(prompt)
    res = JSON.parse(response)
    ap res
    add_info(res["podcasts"])
    # rescue => e
    #   ap e
    #   get_podcast_recommendations
    # end
  end

  def add_info(podcasts)
    np = podcasts.map do |podcast|
      sleep 2
      res = Taddy.find_podcast(podcast["creator"])
      if res
        # add to Podcast
        podcast["uid"] = res["itunesId"]
        podcast["description"] = res["description"]
        podcast["image_url"] = res["imageUrl"]
        episode = RssParser.find_episode(res["rssUrl"], podcast["title"], self)
        if episode
          podcast["audioUrl"] = episode.audio_url
          podcast["title"] = episode.title
          podcast["url"] = episode.url
          podcast["description"] = episode.description
          podcast["publishDate"] = episode.publish_date
          ap podcast
          podcast
        end
      end
    end
    rec = Recommendation.create!(
      user: user,
      date: Date.today,
    )
    np.compact.each do |meta_item|
      item = MetaItem.find_by(title: meta_item["title"])
      item ||= MetaItem.create!(
        uid: meta_item["uid"],
        title: meta_item["title"],
        description: meta_item["description"],
        image_url: meta_item["image_url"],
        creator: meta_item["creator"],
        url: meta_item["url"],
        publish_date: meta_item["publishDate"],
      )
      RecommendedItem.create!(
        recommendation: rec,
        meta_item: item,
      )
    end
    rec
  end

  def completion(prompt)
    ap prompt
    response = client.chat(
      parameters: {
          model: "gpt-4",
          messages: [{ role: "user", content: "#{prompt}"}],
          temperature: 0.7,
      }
    )
    ap response
    response.dig("choices", 0, "message", "content")
  end


  private

  def client
    @_client ||= OpenAI::Client.new(access_token: ENV['OPEN_AI_KEY'])
  end
end
