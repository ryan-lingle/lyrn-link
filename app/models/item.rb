class Item < ApplicationRecord
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :image
	belongs_to :list
	before_create :add_index
	before_create :upload_image

	def add_index
		self.index = list.items.count
	end

	def upload_image
		if self.image_url
			data = encode_image_url(self.image_url)
			self.image.attach(data: data)
		end
	end

	def hosted_image_url
		self.image.attachment.service_url if self.image.attachment
	end

	def to_index_res
		{
			id: self.id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: hosted_image_url,
			url: self.url,
			url_copy: self.url_copy, 
			index: self.index,
			creator: self.creator,
		}
	end
end
