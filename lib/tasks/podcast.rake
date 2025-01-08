require 'csv'

namespace :podcasts do
	desc 'all top podcasts'
	task scrape: :environment do
		file = CSV.read(File.join(File.dirname(__FILE__), '..', 'assets', 'podcasts.csv'))

    file.each do |row|
      ap row
      podcast = Podcast.find_or_create_by(title: row[1], id: row[0])
      ap podcast
      podcast.get_episodes
    end
	end
end