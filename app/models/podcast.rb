class Podcast < ApplicationRecord
    has_many :episodes, dependent: :nullify, class_name: "MetaItem", foreign_key: "podcast_id"
    include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :image
	before_create :upload_image

	def upload_image
		if self.image_url
			data = encode_image_url(self.image_url)
			if data
				self.image.attach(data: data)
			else
				self.image_url = nil
			end
		end
	end

    def self.find_or_create_by(title:)
        podcast = find_by(title: title)
        if podcast
            ap "found podcast in db"
            podcast
        else
            ap "searching taddy"
            res = Taddy.find_podcast(title)
            if res
                create(
                    title: res["name"],
                    description: res["description"],
                    image_url: res["imageUrl"],
                    rss_url: res["rssUrl"],
                    itunes_id: res["itunesId"],
                )
            end
        end
    end

    def find_episode(episode_title:)
        # search for episode in db, if not found, search rss feed

        # search db
        if episodes.any?
            episode = episodes.find_by(title: episode_title)
            if episode
                ap "found episode in db"
                episode
            else
                titles = episodes.pluck(:title)
                title = FuzzyMatch.new(titles).find(episode_title)
                ap title
                ap episode_title
                if title
                    episodes.find_by(title: title)
                else
                    nil
                end
            end
        else
            ap "searching rss feed"
            ap rss_url
            # search rss feed
            feed = RssParser.parse(rss_url)
            if feed
                titles = feed.items.map do |rss_item|
                    meta_item = MetaItem.new(title: rss_item.title)
                    meta_item.update(
                        media_type: "podcast",
                        podcast: self,
                        description: rss_item.description,
                        url: rss_item.link,
                        creator: self.title,
                        publish_date: rss_item.pubDate,
                    )
                    meta_item.title
                end
                title = FuzzyMatch.new(titles).find(episode_title)
                ap title
                ap episode_title
                if title
                    episodes.find_by(title: title)
                else
                    nil
                end
            end
        end
    end
end
