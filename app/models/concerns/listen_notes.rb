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

	private

	def self.reduce_episode(episode)
		{
			title: episode["title_original"],
			description: episode["description_original"],
			itunes_id: episode["itunes_id"],
			image: episode["image"],
			podcast_title: episode["podcast"]["title_original"],
		}
	end
end