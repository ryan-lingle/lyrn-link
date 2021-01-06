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
end