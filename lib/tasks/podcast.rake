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
