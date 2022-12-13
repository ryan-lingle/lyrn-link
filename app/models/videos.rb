class Videos < List
	def singular
		'video'
	end

	def icon
		"fas fa-video"
	end

	def find_image(video)
		if video.url
			if video.url.include?('youtube')
				query = video.url.split('?')[1]
				h = query.split('&').reduce({}) do |mem, split|
					a, b = split.split('=')
					if a && b
						mem[a] = b
					end
					mem
				end
				if h['v']
					"https://i.ytimg.com/vi/#{h['v']}/sddefault.jpg"
				end
			else
				res = Scraper.scrape(video.url)
				if res
					res[:image]
				end
			end
		end
	end
end