require 'open-uri'

class Itunes
	def self.find(id)
		url = "https://itunes.apple.com/lookup?id=#{id}&media=podcast&entity=podcastEpisode&limit=100"
		URI.open(url) do |file|
			rss = File.open(file.path).read
		    feed = JSON.parse(rss)
		   	if feed["results"][0]
		   		feed["results"][0]["artworkUrl100"]
		   	end
		end
	end
end