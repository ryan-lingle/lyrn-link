class List < ApplicationRecord
	belongs_to :user, optional: true
	belongs_to :owner, polymorphic: true
	has_many :items, dependent: :destroy
	before_create :add_index
	validates_uniqueness_of :type, scope: [:owner_id]

	def add_index
		self.index = owner.lists.count
	end

	def re_index_items!
		items.each_with_index do |item, index|
			item.index = index
			item.save
		end
	end

	def to_res(bookmarks=[])
		{
			owner_type: owner.owner_type,
			id: self.id,
			index: self.index,
			type: self.type.downcase,
			singular: singular,
			searchable: self.respond_to?('search'),
			icon: icon,
			create: self.respond_to?('search') ? 'search' : 'scrape',
			deletable: true,
			sortable: true,
			items: item_index(bookmarks),
		}
	end

	def items
		Item.where(list_id: self.id).order(index: :asc).with_attached_image
	end

	def item_index(bookmarks=[])
		items.map { |item| item.to_index_res(bookmarks) }
	end

	def update_item_index!(items)
		items.each do |item_rams|
			item = Item.find(item_rams[:id])
			item.index = item_rams[:index]
			item.save
		end
	end
end
