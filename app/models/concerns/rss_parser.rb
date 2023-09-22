class RssParser
	def self.find_episode(url, episode_title, ai_model)
        ap url
        URI.open(url) do |rss|
            feed = RSS::Parser.parse(rss, false)
            titles = feed.items.map do |item|
                item.title
            end
            ap "In the following set of titles: [#{titles.join(', ')}] find the title that matches: #{episode_title}. If there is no match, type '0'."
            title = ai_model.completion("In the following set of titles: #{titles}, find the title that matches: #{episode_title}. If there is no match, type '0'.")
            ap title
            unless title == "0"
                index = titles.index(title)
                if index.present?
                    item = feed.items.dig(index)
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
    end
end