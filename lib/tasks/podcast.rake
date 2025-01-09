require 'csv'

namespace :podcasts do
	desc 'all top podcasts'
	task scrape: :environment do
		Podcast.all.each do |podcast|
      episode = podcast.episodes.first
      if episode && episode.duration.nil?
        ap podcast.title
        ap "-------------------------------------------------------"
        podcast.get_episodes
      end
    end
  end
end
