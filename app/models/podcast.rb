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

    def self.find_or_create_by(title: nil, id: nil)
        podcast = find_by(title: title)
        if podcast
            ap "found podcast in db"
            podcast
        else
            ap "searching taddy"
            if id
                res = Taddy.find_podcast_by_id(id)
            else
                res = Taddy.find_podcast(title)
            end
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

    def confirm_fuzzy_match(title1, title2, ai_model)
        res = ai_model.completion("#{title1} is a similar podcast episode to #{title2}. If this is correct, please respond with 'true'. If not, please respond with 'false'.")
        res.downcase == "true"
    end


    def find_episode(episode_title:, ai_model:)
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
                if title
                    # is_accurate = confirm_fuzzy_match(episode_title, title, ai_model)
                    # ap is_accurate
                    # if is_accurate
                    # end
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
                    meta_item = MetaItem.find_or_create_by(title: rss_item.title, podcast: self, media_type: "podcast")
                    meta_item.update(
                        media_type: "podcast",
                        podcast: self,
                        description: rss_item.description,
                        audio_url: rss_item.enclosure&.url,
                        creator: self.title,
                        publish_date: rss_item.pubDate,
                    )
                    meta_item.title
                end
                title = FuzzyMatch.new(titles).find(episode_title)
                if title
                    # is_accurate = confirm_fuzzy_match(episode_title, title, ai_model)
                    # ap is_accurate
                    # if is_accurate
                    episodes.find_by(title: title)
                else
                    nil
                end
            end
        end
    end

    def get_episodes
        feed = RssParser.parse(rss_url)
        if feed
            feed.items.each do |rss_item|
                meta_item = MetaItem.find_or_create_by(title: rss_item.title)
                meta_item.update(
                    podcast: self,
                    media_type: "podcast",
                    description: rss_item.description,
                    audio_url: rss_item.enclosure&.url,
                    creator: self.title,
                    publish_date: rss_item.pubDate,
                    duration: get_time_in_seconds(rss_item),
                )
            end
        end
    rescue StandardError => e
        ap e
    end

    def get_time_in_seconds(rss_item)
        if rss_item.itunes_duration
            hours = rss_item.itunes_duration.hour || 0
            minutes = rss_item.itunes_duration.minute || 0
            seconds = rss_item.itunes_duration.second || 0
            (hours * 3600) + (minutes * 60) + seconds
        else
            0
        end
    end
end
