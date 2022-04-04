class Videos < List
	def singular
		'video'
	end

	def icon
		"fal fa-video"
	end

	def find_image(video)
		if video.url
			res = Scraper.scrape(video.url)
			if res
				res[:image]
			end
		end
	end
end