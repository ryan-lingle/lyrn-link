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
      ap podcast_meta_items

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
  rescue => e
    Recommendation.where(user: user, date: Date.today).destroy_all
    raise e
  end

  def get_book_recommendations(n=3)
    prompt = "The following are my all time favorite books: #{book_titles}. Can you recommend #{n} more REAL BOOKS for me based on the books I like. Structure the response only as a JSON object I can parse. Here is an example: '{ 'books': [{ 'title': 'Book Title', 'creator': 'Book Author', isbn: 'Book ISBN' }] }'"
    parsed_gpt_response = completion(prompt, true)
    books = parsed_gpt_response["books"]
    if !books.is_a?(Array)
      books = [books]
    end
    books_meta_items = filter_items(add_book_info(books), "books")
    if books_meta_items.count < n
      books_meta_items += get_book_recommendations(n - books_meta_items.count)
    end
    books_meta_items
  end

  def add_book_info(recs)
    nb = recs.map do |rec|
      item = MetaItem.find_by(uid: rec["isbn"])
      if item
        item
      else
        sleep 2
        res = GoogleBooks.search_by_uid(rec["isbn"])
        if res
          item = MetaItem.create!(
            media_type: 'book',
            uid: res[:uid],
            title: res[:title],
            description: res[:description],
            image_url: res[:image_url],
            creator: res[:creator],
            publish_date: res[:publish_date],
          )
        end
      end
    end
    return nb.compact
  end

  def filter_items(meta_items, type)
    previous = user.send("recommended_#{type}").pluck(:title)
    posted = user.lists.find_by(type: type.capitalize)&.items.pluck(:title) || []
    black_list = previous + posted
    uniq = meta_items.uniq { |meta_item| meta_item.title }
    uniq.reject do |meta_item|
      black_list.include?(meta_item.title)
    end
  end

  def get_podcast_recommendations(n=8)
    prompt = "The following are my all time favorite podcast episodes: #{podcast_titles}. Can you recommend #{n} more REAL PODCAST EPISODES from Apple Podcasts (not audiobooks) for me based on the episodes I like. Please do not include any of the following episodes: #{previous_podcast_titles}. Structure the response only as a JSON object I can parse. Here is an example: '{ 'podcasts': { 'title': 'Episode Title', 'creator': 'Podcast Title' } }'"
    parsed_gpt_response = completion(prompt, true)
    podcasts = parsed_gpt_response["podcasts"]
    ap podcasts
    if !podcasts.is_a?(Array)
      podcasts = [podcasts]
    end
    podcast_meta_items = filter_items(add_info(podcasts), "podcasts")
    if podcast_meta_items.count < n
      podcast_meta_items += get_podcast_recommendations(n - podcast_meta_items.count)
    end
    podcast_meta_items
  end
  

  def add_info(recs)
    # recs = [{ "title": "Episode Title", "creator": "Podcast Title" }]

    np = recs.map do |rec|
      sleep 2
      podcast = Podcast.find_or_create_by(title: rec["creator"])
      if podcast

        # add podcast info to rec
        rec["uid"] = podcast.itunes_id
        rec["image_url"] = podcast.image_url
        podcast.find_episode(episode_title: rec["title"], ai_model: self)
      end
    end

    return np.compact
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
          model: "gpt-4o",
          messages: [{ role: "user", content: "#{prompt}"}],
          temperature: 1,
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
  rescue JSON::ParserError => e
    ap e
    completion(prompt, json)
  end


  private

  def client
    @_client ||= OpenAI::Client.new(access_token: ENV['OPEN_AI_KEY'])
  end
end
