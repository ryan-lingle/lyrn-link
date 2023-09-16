class AiMailer < ActionMailer::Base
    default from: 'hi@lyrn.link'
    
    def test(user)
        @user = user
        @books = user.ai_model.get_book_recommendations
        @podcasts = user.ai_model.get_podcast_recommendations
        mail(to: @user.email, subject: "Lyrnlink AI Weekly [Test]")
    end
  end