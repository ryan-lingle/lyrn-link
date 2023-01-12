class Scraper
	def self.scrape(url)
		sleep 1
		begin
			if url.include?('youtube')
				youtube(url)
			else
				doc = Nokogiri::HTML.parse(URI.open(url, 'User-Agent' => 'lyrn-link'))
				image_meta = doc.at('meta[property="og:image"]')
				title_meta = doc.at('meta[property="og:title"]')
				description_meta = doc.at('meta[property="og:description"]')
				{
					image: image_meta && image_meta["content"],
					title: title_meta && title_meta["content"],
					description: description_meta && description_meta["content"],
				}
			end
		rescue StandardError => e
			{}
		end
	end

	def self.youtube(url)
		query = url.split('?')[1]
		h = query.split('&').reduce({}) do |mem, split|
			a, b = split.split('=')
			mem[a] = b
			mem
		end

		json = RestClient.get(
			"https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=#{h['v']}&key=AIzaSyCYbaDcWSJBueVahTqdNl6YppfTvyyOFZw",
		)

		response = JSON.parse(json.body)
		begin
			{
				image: response.body["items"][0]["snippet"]["thumbnails"]["standard"]["url"],
				title: response.body["items"][0]["snippet"]["title"],
				description: response.body["items"][0]["snippet"]["description"],
			}
		rescue StandardError => e
			{}
		end
	end
end