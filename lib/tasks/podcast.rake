require 'csv'

namespace :podcasts do
	desc 'all top podcasts'
	task scrape: :environment do
    MetaItem.where(items: Item.where(list: List.where(type: "Podcasts"))).where(podcast_id: nil).each do |meta_item|
      podcast = Podcast.find_or_create_by(title: meta_item.creator)
      if podcast.present?
        podcast.update(in_network: true)
        meta_item.podcast = podcast
        meta_item.save
        unless podcast.episodes.count > 10
          ap "scraping #{podcast.title}"
          podcast.get_episodes
        end
      else
        "podcast not found: #{meta_item.creator}"
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
