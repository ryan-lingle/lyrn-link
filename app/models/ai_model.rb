class AiModel < ApplicationRecord
  belongs_to :user

  def book_titles
    books = user.lists.find_by(type: "Books")
    if books
      titles = books.items.pluck(:title)
      if titles.any?
        titles.join(', ')
      end
    end
  end

  def has_books?
    book_titles.present?
  end

  def podcast_titles
    podcasts = user.lists.find_by(type: "Podcasts")
    if podcasts
      titles = podcasts.items.pluck(:title)
      if titles.any?
        titles.join(', ')
      end
    end
  end

  def has_podcasts?
    podcast_titles.present?
  end

  def get_book_recommendations
    begin
      response = client.chat(
          parameters: {
              model: "gpt-3.5-turbo", # Required.
              messages: [{ role: "user", content: "I like the following books: #{book_titles}. Can you recommend 10 more unique books for me based on the books I like. Can you structure the response as a JSON object formatted like: '{ 'books': { 'title': 'Book Title Example', 'creator': 'Author Example' } }'?"}],
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
    begin
      response = client.chat(
          parameters: {
              model: "gpt-3.5-turbo", # Required.
              messages: [{ role: "user", content: "I like the following podcast episodes: #{podcast_titles}. Can you recommend 10 more unique podcast episodes for me based on the episodes I like. Can you structure the response as a JSON object formatted like: '{ 'podcasts': { 'title': 'Episode Title', 'creator': 'Podcast Title' } }'?"}],
              temperature: 0.7,
          }
      )
      res = JSON.parse(response.dig("choices", 0, "message", "content"))
      res["podcasts"]
    rescue => e
      ap e
      get_podcast_recommendations
    end
  end


  private

  def client
    @_client ||= OpenAI::Client.new(access_token: ENV['OPEN_AI_KEY'])
  end
end
