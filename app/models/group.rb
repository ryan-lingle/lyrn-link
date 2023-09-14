class Group < ApplicationRecord
	HANDLE_WHITELIST = %w(a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 _)
	has_many :group_relationships, dependent: :destroy
	has_many :group_invites, dependent: :destroy
	has_many :users, through: :group_relationships
	has_many :activities, dependent: :destroy, as: :owner
	has_many :user_activities, class_name: "Activity", through: :users, source: :activities
	include ActiveStorageSupport::SupportForBase64
	include EncodeImageUrl
	include Listable
	include Feedable
	has_one_base64_attached :image
	after_create :add_admin_to_group
	belongs_to :user
	validates :handle, presence: true, uniqueness: { case_sensitive: false }
	validates :name, presence: true
	has_many :lists, -> { order(index: :asc) }, dependent: :destroy, as: :owner

	def activity_set
		(user_activities + activities).sort_by(&:created_at).reverse
	end

	def image_url
		image.service_url if image.attached?
	end

	def url
		ENV["DOMAIN"] + '/g/' + self.handle
	end

	def to_index_res(groups=[], index=nil)
		{
			id: self.id,
			index: index,
			title: self.name,
			description: self.description,
			url: url,
			internal_url: true,
			image_url: self.image_url,
			count: self.member_count,
			joined: groups.include?(self.id),
			private_group: self.private,
		}
	end

	def to_res(current_user=nil)
		to_show_res(current_user)
	end



	def to_show_res(current_user=nil)
		bis = current_user&.bookmarked_items&.pluck(:id) || []
		flwing = current_user&.following&.pluck(:id) || []
		is_admin = current_user == self.user
		{
			id: self.id,
			name: self.name,
			handle: self.handle,
			description: self.description,
			image: self.image_url,
			joined: users.include?(current_user),
			private: self.private,
			uncreated_lists: uncreated_lists,
			tabs: [
				{
					tab: 'group',
					icon: 'fa-solid fa-circle-notch',
					sub_tabs: [
						{
							type: 'members',
							items: user_index(flwing: flwing, admin: is_admin),
						},
						{
							type: 'items',
							items: item_index(bis: bis),
						}
					]
				},
				{
					tab: 'feed',
					icon: 'fa-solid fa-newspaper',
					sub_tabs: [
						{
							type: 'feed',
							items: feed(is_group: true),
						}
					],
				},
				{
					tab: 'lists',
					title: 'Featured',
					icon: 'fa-solid fa-clipboard-list',
					sub_tabs: list_index(bis),
				},

			]
		}
	end

	def owner_type
		"group"
	end

	def update_image(image)
		self.image.attach(data: image)
		self.save
	end

	def user_index(offset: 0, flwing: [], admin: false)
		res = User.where("id in (SELECT user_id FROM group_relationships WHERE accepted = true AND group_id = '#{self.id}')").order(follower_count: :desc, handle: :asc).offset(offset).limit(100).each_with_index.map do |u, i| 
			u.to_index_res(flwing, offset + i, true)
		end
		if admin
			invite_index.concat(res)
		else
			res
		end
	end

	def item_index(offset: 0, bis: [])
		MetaItem.where("id in (SELECT items.meta_item_id FROM items INNER JOIN lists ON items.list_id = lists.id WHERE lists.owner_type = 'User' AND lists.owner_id in (SELECT user_id FROM group_relationships WHERE accepted = true AND group_id = '#{self.id}'))").order(count: :desc, title: :asc).offset(offset).limit(100).each_with_index.map do |item, i| 
			item.to_index_res(bis, offset + i, true)
		end
	end

	def invite_index(flwing: [])
		users.where("group_relationships.accepted = false").map do |u, i|
			res = u.to_index_res(flwing)
			res[:pending] = true
			res
		end
	end

	def clean_handle
		split = self.name.downcase.gsub('-', '_').gsub(' ', '_').split('').select do |l|
			HANDLE_WHITELIST.include?(l)
		end
		self.handle = split.join('')
	end

	def add_admin_to_group
		GroupRelationship.create!(group: self, user: self.user, accepted: true)
	end
end
