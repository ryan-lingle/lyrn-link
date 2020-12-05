class Item < ApplicationRecord
	belongs_to :list
	before_create :add_index
	
	def add_index
		self.index = list.items.count
	end

	def to_index_res
		{
			id: self.id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image: self.image,
			url: self.url,
			url_copy: self.url_copy, 
			index: self.index,
			creator: self.creator,
		}
	end
end
