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

	desc 'get images back'
	task images: :environment do
		People.all.each do |list|
			list.items.each do |item|
				res = list.find_image(item)
				if res
					item.image_url = res
					item.upload_image
					item.save
				end
			end
		end
	end

	desc 'get images back'
	task test_images: :environment do
		List.where(user_id: 'eca93597-3b5a-4876-b7fd-0e7899b4e8c2').each do |list|
			list.items.each do |item|
				res = list.find_image(item)
				if res
					item.image_url = res
					item.upload_image
					item.save
				end
			end
		end
	end
end