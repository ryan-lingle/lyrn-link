class ListenNotes
	def self.search(term, offset: 0)
		response = Unirest.get(
			"https://listen-api.listennotes.com/api/v2/search?q=#{term}&type=episode&offset=#{offset}&language=English",
		  	headers: {
		    	"X-ListenAPI-Key" => "0a5c5bf8b8294eafab570b23a18367e7",
		  	}
		)

		results = response.body["results"]
		results.map do |episode|
			reduce_episode(episode)
		end
	end

	def self.find(podcast)
		response = Unirest.get(
			"https://listen-api.listennotes.com/api/v2/search?q=\"#{podcast.title}\"&type=episode&language=English",
		  	headers: {
		    	"X-ListenAPI-Key" => "0a5c5bf8b8294eafab570b23a18367e7",
		  	}
		)

		results = response.body["results"]
		results = results.map do |episode|
			reduce_episode(episode)
		end
		results.first

		if results.first
			results.first[:image_url]
		end
	end

	private

	def self.reduce_episode(episode)
		{
			title: episode["title_original"],
			description: episode["description_original"],
			uid: episode["itunes_id"],
			image_url: episode["image"],
			creator: episode["podcast"]["title_original"],
			publish_date: parse_date(episode["pub_date_ms"]),
		}
	end

	def self.parse_date(ms)
		sec = (ms.to_f / 1000).to_s
		Date.strptime(sec, '%s')
	end
end