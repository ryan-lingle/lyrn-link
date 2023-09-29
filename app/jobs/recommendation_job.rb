class RecommendationJob < ApplicationJob
  queue_as :default

  def perform(user)
    recommendation = user.ai_model.create_recommendation
    AiMailer.test(recommendation).deliver_later
  end
end