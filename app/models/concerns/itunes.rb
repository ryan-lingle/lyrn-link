require 'open-uri'

class Itunes
	def self.find(id)
		sleep 1
		url = "https://itunes.apple.com/lookup?id=#{id}&media=podcast&entity=podcastEpisode&limit=100"
		URI.open(url) do |file|
			if file.respond_to?('path')
				rss = File.open(file.path).read
			    feed = JSON.parse(rss)
			   	if feed["results"][0]
			   		feed["results"][0]
			   	end
			end
		end
	end
end