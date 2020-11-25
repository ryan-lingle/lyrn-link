class List < ApplicationRecord
	belongs_to :user
	has_many :items, dependent: :destroy
	before_create :add_index
	validates_uniqueness_of :type, scope: [:user_id]

	def add_index
		self.index = user.lists.count
	end

	def to_res
		{
			index: self.index,
			type: self.type.downcase,
			singular: singular,
			searchable: self.respond_to?('search'),
			items: item_index,
		}
	end

	def items
		Item.where(list_id: self.id).order(index: :asc)
	end

	def item_index
		items.map { |item| item.to_index_res }
	end
end
