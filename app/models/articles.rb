class Articles < List
	def singular
		'article'
	end

	def icon
		"fas fa-newspaper"
	end

	def find_image(article)
		if article.url
			res = Scraper.scrape(article.url)
			if res
				res[:image]
			end
		end
	end
end