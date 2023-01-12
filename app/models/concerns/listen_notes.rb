class ListenNotes
	def self.search(term, offset: 0)
		json = RestClient.get(
			"https://listen-api.listennotes.com/api/v2/search?q=#{term}&type=episode&offset=#{offset}&language=English",
		  	{
		    	"X-ListenAPI-Key" => "0a5c5bf8b8294eafab570b23a18367e7",
		  	}
		)

		response = JSON.parse(json.body)
		results = response["results"]
		results.map do |episode|
			reduce_episode(episode)
		end
	end

	def self.find(title)
		sleep 1
		url = "https://listen-api.listennotes.com/api/v2/search?q=\"#{title}\"&only_in=title&type=podcast&language=English"
		json = RestClient.get(
			url,
		  	{
		    	"X-ListenAPI-Key" => "0a5c5bf8b8294eafab570b23a18367e7",
		  	}
		)
		response = JSON.parse(json.body)
		results = response["results"]
		return results
		results = results.map do |episode|
			reduce_episode(episode)
		end

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