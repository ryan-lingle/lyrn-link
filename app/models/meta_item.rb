class MetaItem < ApplicationRecord
	has_many :bookmarks, dependent: :destroy
	has_many :items
	has_many :lists, through: :items
	has_many :users, through: :lists
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :image
	before_create :upload_image

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

	def to_index_res(bookmarks=[], index=nil, count=false)
		{
			id: self.id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: self.image.attached? ? self.image.service_url : '',
			url: self.url,
			url_copy: self.url_copy, 
			creator: self.creator,
			index: index,
			show_count: true,
			bookmarked: bookmarks.include?(self.id),
			count: count ? self.count : nil,
		}
	end
end
