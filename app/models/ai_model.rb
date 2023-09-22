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
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: "I like the following books: #{book_titles}. Can you recommend 10 more REAL books for me based on the books I like. Sort the results from most to least compatible. And structure the response as a JSON object formatted like: '{ 'books': { 'title': 'Book Title Example', 'creator': 'Author Example' } }'?"}],
              temperature: 0.7,
          }
      )
      res = JSON.parse(response.dig("choices", 0, "message", "content"))
      res["books"]
    rescue => e
      ap e
      get_book_recommendations
    end
  end

  def get_podcast_recommendations
      response = client.chat(
          parameters: {
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: "I like the following podcast episodes: #{podcast_titles}. Can you recommend 10 more REAL PODCAST EPISODES (not audiobooks) for me based on the episodes I like. Sort the results from most to least compatible. And structure the response as a JSON object formatted like: '{ 'podcasts': { 'title': 'Episode Title', 'creator': 'Podcast Title' } }'?"}],
              temperature: 0.7,
          }
      )
      res = JSON.parse(response.dig("choices", 0, "message", "content"))
      ap res
      add_info(res["podcasts"])
    # rescue => e
    #   ap e
    #   get_podcast_recommendations
    # end
  end

  def add_info(podcasts)
    np = podcasts.map do |podcast|
      sleep 5
      res = Taddy.find_podcast(podcast["creator"])
      ap res
      if res
        # add to Podcast
        podcast["uid"] = res["itunesId"]
        podcast["description"] = res["description"]
        podcast["image_url"] = res["imageUrl"]
        # episode = RssParser.find_episode(res["rssUrl"], podcast["title"], self)
        # ap episode
        # if episode
        #   podcast["audioUrl"] = episode.audio_url
        #   podcast["title"] = episode.title
        #   podcast["url"] = episode.url
        #   podcast["description"] = episode.description
        #   podcast["publishDate"] = episode.publish_date
        #   podcast
        # end
        podcast
      end
    end
    np.compact.each do |meta_item|
      meta_item = MetaItem.create!(
        uid: meta_item["uid"],
        title: meta_item["title"],
        description: meta_item["description"],
        image_url: meta_item["image_url"],
        creator: meta_item["creator"],
      )
      Recommendation.create!(
        user: user,
        meta_item: meta_item,
      )
    end
  end

  def completion(prompt)
    response = client.chat(
      parameters: {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "#{prompt}"}],
          temperature: 0.7,
      }
    )
    response.dig("choices", 0, "message", "content")
  end


  private

  def client
    @_client ||= OpenAI::Client.new(access_token: ENV['OPEN_AI_KEY'])
  end
end
