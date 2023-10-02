class MetaItem < ApplicationRecord
	has_many :bookmarks, dependent: :destroy
	has_many :items
	has_many :lists, through: :items
	has_many :comments, dependent: :destroy, as: :item
	has_many :comment_users, -> { distinct }, through: :comments, source: :user
	belongs_to :podcast, optional: true
	has_many :recommended_items, dependent: :destroy
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	include Rails.application.routes.url_helpers
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

	def comment_index
		comments.map do |comment|
			comment.to_res
		end
	end

	def href
		"#{ENV['DOMAIN']}/i/#{id}"
	end

	def to_index_res(bookmarks=[], index=nil, count=false)
		{
			trueItem: true,
			id: self.id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: persistent_image_url,
			url: self.url,
			url_copy: self.url_copy, 
			creator: self.creator,
			index: index,
			show_count: true,
			internal_href: href,
			bookmarked: bookmarks.include?(self.id),
			count: count ? self.count : nil,
		}
	end

	def persistent_image_url
		if podcast.present?
			podcast.image.attached? ? polymorphic_path_with_domain(podcast.image) : ''
		else
			image.attached? ? polymorphic_path_with_domain(image) : ''
		end
	end

	def polymorphic_path_with_domain(attachment)
		ENV['DOMAIN'] + polymorphic_url(attachment, only_path: true)
	end

	def to_show_res(bookmarks=[])
		{
			id: self.id,
			meta_item_id: self.id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: self.image.attached? ? self.image.service_url : '',
			url: self.url,
			url_copy: self.url_copy, 
			creator: self.creator,
			internal_href: href,
			bookmarked: bookmarks.include?(self.id),
			button: 'bookmark',
			comments: comment_index,
			type: 'MetaItem',
		}
	end
end
