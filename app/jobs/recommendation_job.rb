class RecommendationJob < ApplicationJob
  queue_as :default

  def perform(user)
    recommendation = user.ai_model.get_podcast_recommendations
    AiMailer.test(recommendation).deliver_later
  end
end