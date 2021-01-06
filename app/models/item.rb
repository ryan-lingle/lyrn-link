class Item < ApplicationRecord
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :image
	belongs_to :list
	has_many :bookmarks, dependent: :destroy
	has_many :users, through: :bookmarks
	before_create :add_index
	before_create :upload_image

	def add_index
		self.index = list.items.count
	end

	def upload_image
		if self.image_url
			data = encode_image_url(self.image_url)
			if data
				self.image.attach(data: data)
				self.image_url = "https://lyrn-link.s3.us-east-2.amazonaws.com/" + self.image.attachment.blob.key
			end
		end
	end

	def to_index_res(bookmarks=[])
		{
			id: self.id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: self.image_url,
			url: self.url,
			url_copy: self.url_copy, 
			index: self.index,
			creator: self.creator,
			bookmarked: bookmarks.include?(self.id),
		}
	end
end
