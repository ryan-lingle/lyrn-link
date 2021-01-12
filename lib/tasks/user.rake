namespace :user do
	desc 'store public s3 url on image_url'
	task set_profile_picture_url: :environment do
		User.all.each do |user|
			if user.profile_picture.attachment
				user.profile_picture_url = "https://lyrn-link.s3.us-east-2.amazonaws.com/" + user.profile_picture.attachment.blob.key
				user.save!
				ap user
			end
		end
	end

	desc 'save twitter handle'
	task twitter_handles: :environment do
		User.all.each do |user|
			if user.twitter_client
				user.twitter_handle = user.twitter_client.user.screen_name
				user.save
			end
		rescue => e
			puts e
		end
	end
end