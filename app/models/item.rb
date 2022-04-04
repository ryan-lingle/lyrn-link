class Item < ApplicationRecord
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :image
	belongs_to :list
	belongs_to :meta_item, required: false
	# has_many :bookmarks, dependent: :destroy
	# has_many :users, through: :bookmarks
	before_create :add_index
	before_create :upload_image
	after_create :create_or_update_meta_item

	def title_clean
		whitelist = "0123456789abcdefghijklmnopqrstuvwxyz ".split("")
		clean = (self.title || '').split('').filter do |l|
			whitelist.include?(l.downcase)
		end
		clean.join('')
	end

	def add_index
		self.index = list.items.count
	end

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



	def to_index_res(bookmarks=[])
		{
			id: self.id,
			meta_item_id: self.meta_item_id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: self.image.attached? ? self.image.service_url : '',
			url: self.url,
			url_copy: self.url_copy, 
			index: self.index,
			creator: self.creator,
			bookmarked: bookmarks.include?(self.meta_item_id),
			button: 'bookmark',
		}
	end

	def create_or_update_meta_item
		meta_item = MetaItem.find_by(title: self.title)

		if meta_item
			meta_item.count += 1
			meta_item.save
		else
			meta_item = MetaItem.create!(
				uid: self.uid,
				title: self.title,
				subtitle: self.subtitle,
				description: self.description,
				image_url: self.image_url,
				url: self.url,
				url_copy: self.url_copy,
				creator: self.creator,
				categories: self.categories,
				publish_date: self.publish_date,
			)
		end

		self.meta_item = meta_item
		self.save!
	end
	
end
