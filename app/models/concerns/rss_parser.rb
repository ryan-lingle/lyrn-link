class RssParser
	def self.parse(url)
        URI.open(url) do |rss|
            return RSS::Parser.parse(rss, false)
        end
    rescue OpenURI::HTTPError => e
        ap e
        return nil
    end
end