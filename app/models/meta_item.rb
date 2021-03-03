class MetaItem < ApplicationRecord
	has_many :bookmarks, dependent: :destroy
	has_many :items
	has_many :lists, through: :items
	has_many :users, through: :lists

	def to_index_res(bookmarks=[], index=nil, count=false)
		{
			id: self.id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: self.image_url,
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
