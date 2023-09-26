class AiMailer < ActionMailer::Base
    default from: 'hi@lyrn.link'
    
    def test(recommendation)
        @user = recommendation.user
        @items = recommendation.meta_items
        @domain = domain
        mail(to: @user.email, subject: "Lyrnlink AI Weekly [Test]")
    end

    def domain
        ENV["DOMAIN"]
    end
  end