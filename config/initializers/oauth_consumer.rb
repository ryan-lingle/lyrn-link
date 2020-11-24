OauthConsumer = OAuth::Consumer.new(
	ENV["TWITTER_KEY"],
	ENV["TWITTER_SECRET_KEY"], 
	:site => "https://api.twitter.com"
)