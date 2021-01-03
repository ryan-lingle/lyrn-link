class List < ApplicationRecord
	belongs_to :user
	has_many :items, dependent: :destroy
	before_create :add_index
	validates_uniqueness_of :type, scope: [:user_id]

	def add_index
		self.index = user.lists.count
	end

	def re_index_items!
		items.each_with_index do |item, index|
			item.index = index
			item.save
		end
	end

	def to_res(current_user=nil)
		{
			id: self.id,
			index: self.index,
			type: self.type.downcase,
			singular: singular,
			searchable: self.respond_to?('search'),
			icon: icon,
			items: item_index(current_user),
		}
	end

	def items
		Item.where(list_id: self.id).order(index: :asc)
	end

	def item_index(current_user=nil)
		items.map { |item| item.to_index_res(current_user) }
	end

	def update_item_index!(items)
		items.each do |item_rams|
			item = Item.find(item_rams[:id])
			item.index = item_rams[:index]
			item.save
		end
	end
end
