class Group < ApplicationRecord
	HANDLE_WHITELIST = %w(a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 _)
	has_many :group_relationships
	has_many :users, through: :groups
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :image

	def to_index_res
		{
			title: self.name,
			description: self.description,
			url:  ENV["DOMAIN"] + '/g/' + self.handle,
			internal_url: true,
		}
	end

	def to_show_res
		{
			id: self.id,
			name: self.name,
			handle: self.handle,
			description: self.description,
			# image: image_url,
			circle: [
				{
					type: 'members',
					items: user_index,
				},
				{
					type: 'items',
					items: item_index,
				}
			],
		}
	end

	def user_index(offset: 0, flwing: [])
		User.where("id in (SELECT user_id FROM group_relationships WHERE group_id = '#{self.id}')").order(follower_count: :desc, handle: :asc).offset(offset).limit(100).each_with_index.map do |u, i| 
			u.to_index_res(flwing, offset + i, true)
		end
	end

	def item_index(offset: 0, bis: [])
		MetaItem.where("id in (SELECT items.meta_item_id FROM items INNER JOIN lists ON items.list_id = lists.id WHERE lists.user_id in (SELECT user_id FROM group_relationships WHERE group_id = '#{self.id}'))").order(count: :desc, title: :asc).offset(offset).limit(100).each_with_index.map do |item, i| 
			item.to_index_res(bis, offset + i, true)
		end
	end

	def clean_handle
		split = self.handle.downcase.gsub('-', '_').gsub(' ', '_').split('').select do |l|
			HANDLE_WHITELIST.include?(l)
		end
		self.handle = split.join('')
	end
end
