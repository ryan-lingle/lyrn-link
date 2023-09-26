class RssParser
	def self.find_episode(url, episode_title, ai_model)
        ap url
        URI.open(url) do |rss|
            feed = RSS::Parser.parse(rss, false)
            titles = feed.items.map do |item|
                item.title
            end
            title = FuzzyMatch.new(titles).find(episode_title)
            ap episode_title
            ap title
            unless title == "0"
                ap titles
                ap title
                index = titles.index(title)
                ap index
                if index.present?
                    item = feed.items && feed.items[index]
                    ap item
                    if item
                        OpenStruct.new(
                            title: item.title,
                            audio_url: item.enclosure.url,
                            url: item.link,
                            description: item.description,
                            publish_date: item.pubDate
                        )
                    end
                end

            end
        end
    rescue OpenURI::HTTPError => e
        ap e
        return nil
    end
end