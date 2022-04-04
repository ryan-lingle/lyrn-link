class Scraper
	def self.scrape(url)
		doc = Nokogiri::HTML.parse(open(url, 'User-Agent' => 'lyrn-link'))
		image_meta = doc.at('meta[property="og:image"]')
		title_meta = doc.at('meta[property="og:title"]')
		description_meta = doc.at('meta[property="og:description"]')
		{
			image: image_meta && image_meta["content"],
			title: title_meta && title_meta["content"],
			description: description_meta && description_meta["content"],
		}
	end
end