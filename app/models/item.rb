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
			description: self.description,
			image: self.image,
			url: self.url,
			index: self.index,
		}
	end
end
