class AiMailer < ActionMailer::Base
    default from: 'hi@lyrn.link'
    
    def test(recommendation)
        @user = recommendation.user
        @podcasts = recommendation.podcasts
        @books = recommendation.books
        @domain = domain
        mail(to: @user.email, subject: "Lyrnlink AI Daily [Test]")
    end

    def domain
        ENV["DOMAIN"]
    end
  end