require 'csv'

namespace :podcasts do
	desc 'all top podcasts'
	task scrape: :environment do
    MetaItem.where(items: Item.where(list: List.where(type: "Podcasts"))).each do |meta_item|
      podcast = Podcast.find_or_create_by(uid: meta_item.uid, title: meta_item.creator)
      if podcast.present?
        if meta_item.podcast_id != podcast.id
          podcast.update(in_network: true)
          meta_item.podcast = podcast
          meta_item.save
          unless podcast.episodes.count > 10
            ap "scraping #{podcast.title}"
            podcast.get_episodes
          end
        else
          ap "podcast already in network"
        end
      else
        "podzcast not found: #{meta_item.creator}"
      end
    end

    # """
    #   SELECT title,audio_url FROM meta_items WHERE meta_items.id IN (SELECT items.meta_item_id FROM items WHERE items.list_id IN (SELECT lists.id FROM lists WHERE lists.type = 'Podcasts' AND lists.owner_type = 'User' AND lists.owner_id = 'eca93597-3b5a-4876-b7fd-0e7899b4e8c2'))
    # """
  end

  task combine: :environment do
    Item.all.each do |item|
      meta_item = MetaItem.where(title: item.title).where("audio_url IS NOT NULL").first
      if meta_item
        item.meta_item.update(
          audio_url: meta_item.audio_url,
          duration: meta_item.duration,
        )
      end

    end
  end

  task rank: :environment do
    file = CSV.read(File.join(File.dirname(__FILE__), '..', 'assets', 'podcasts.csv'))
    file.each_with_index do |row, index|
      podcast = Podcast.find_by(title: row[1])
      if podcast
        ap podcast
        podcast.update(rank: index + 1)
      end
    end
  end
end
