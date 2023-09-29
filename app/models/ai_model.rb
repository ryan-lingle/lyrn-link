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

  def previous_podcast_titles
    user.recommended_podcasts.map { |item| "#{item.title} by #{item.creator}" }.join(', ')
  end

  def previous_book_titles
    user.recommended_books.map { |item| "#{item.title} by #{item.creator}" }.join(', ')
  end

  def has_podcasts?
    podcast_titles.present?
  end

  def create_recommendation
    if has_books? && has_podcasts?
      rec = Recommendation.find_or_create_by(
        user: user,
        date: Date.today,
      )

      # get books
      books_meta_items = get_book_recommendations
      podcast_meta_items = get_podcast_recommendations

      # add to recommendation
      books_meta_items.each do |meta_item|
        RecommendedItem.create!(
          recommendation: rec,
          meta_item: meta_item,
        )
      end

      # add to recommendation
      podcast_meta_items.each do |meta_item|
        RecommendedItem.create!(
          recommendation: rec,
          meta_item: meta_item,
        )
      end
    end
    rec
  end

  def get_book_recommendations
    prompt = "The following are my all time favorite books: #{book_titles}. Can you recommend 5 more REAL BOOKS for me based on the books I like. Please do not include any of the following books: #{previous_book_titles}. Structure the response only as a JSON object I can parse. Here is an example: '{ 'books': [{ 'title': 'Book Title', 'creator': 'Book Author', isbn: 'Book ISBN' }] }'"
    res = completion(prompt, true)
    add_book_info(res["books"])
  end

  def add_book_info(books)
    nb = books.map do |book|
      sleep 2
      res = GoogleBooks.search_by_uid(book["isbn"])
      res
    end
    return nb.compact.map do |meta_item|
      item = MetaItem.find_by(uid: meta_item[:uid])
      item ||= MetaItem.create!(
        media_type: 'book',
        uid: meta_item[:uid],
        title: meta_item[:title],
        description: meta_item[:description],
        image_url: meta_item[:image_url],
        creator: meta_item[:creator],
        publish_date: meta_item[:publish_date],
      )
      item
    end
  end

  def get_podcast_recommendations
    prompt = "The following are my all time favorite podcast episodes: #{podcast_titles}. Can you recommend 5 more REAL PODCAST EPISODES from Apple Podcasts (not audiobooks) for me based on the episodes I like. Please do not include any of the following episodes: #{previous_podcast_titles}. Structure the response only as a JSON object I can parse. Here is an example: '{ 'podcasts': { 'title': 'Episode Title', 'creator': 'Podcast Title' } }'"
    res = completion(prompt, true)
    add_info(res["podcasts"])
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
    return np.compact.map do |meta_item|
      item = MetaItem.find_by(title: meta_item["title"])
      item ||= MetaItem.create!(
        media_type: 'podcast',
        uid: meta_item["uid"],
        title: meta_item["title"],
        description: meta_item["description"],
        image_url: meta_item["image_url"],
        creator: meta_item["creator"],
        url: meta_item["url"],
        publish_date: meta_item["publishDate"],
      )
      item
    end
  end

  def get_sub_string(string="")
    first = string.split("").find_index("{")
    last = string.reverse.split("").find_index("}")
    last = string.length - last - 1
    string[first..last]
  end

  def completion(prompt, json=false)
    ap prompt
    response = client.chat(
      parameters: {
          model: "gpt-4",
          messages: [{ role: "user", content: "#{prompt}"}],
          temperature: 0.7,
      }
    )
    string = response.dig("choices", 0, "message", "content")
    ap string
    if json
      substring = get_sub_string(string)
      res = JSON.parse(substring)
      ap res
      res
    else
      string
    end
  end


  private

  def client
    @_client ||= OpenAI::Client.new(access_token: ENV['OPEN_AI_KEY'])
  end
end
