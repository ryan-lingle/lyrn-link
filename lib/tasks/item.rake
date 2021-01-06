namespace :item do
	desc 'store public s3 url on image_url'
	task set_image_url: :environment do
		Item.all.each do |item|
			if item.image.attachment
				item.image_url = "https://lyrn-link.s3.us-east-2.amazonaws.com/" + item.image.attachment.blob.key
				item.save
				ap item
			end
		end
	end
end