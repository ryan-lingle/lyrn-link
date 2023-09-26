class AiDailyJob < ApplicationJob
    queue_as :default
  
    def perform
         User.all.each do |user|
            if user.subscribed?('ai_daily')
                RecommendationJob.perform_later(user)
            end
        end
    end
end