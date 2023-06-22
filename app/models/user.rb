class User < ApplicationRecord
	HANDLE_WHITELIST = %w(a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 _)
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	include Feedable
	has_one_base64_attached :profile_picture

	validates :handle, presence: true, uniqueness: { case_sensitive: false }

	has_one :affiliate_sign_up, class_name: "AffiliateSignUp", foreign_key: "user_id", dependent:  :destroy
	has_one :affiliate, through: :affiliate_sign_up, source: :affiliate

	has_many :sign_ups, class_name: "AffiliateSignUp", foreign_key: "affiliate_id", dependent: :destroy
	has_many :users_signed_up, through: :sign_ups, source: :user


	has_many :likes, class_name: "Like", foreign_key: "like_id"
	has_many :likers, class_name: "Like", foreign_key: "link_id"
	has_many :following, through: :likes, source: :link
	has_many :followers, through: :likers, source: :like

	has_many :activities, dependent: :destroy

	has_many :follower_activities, class_name: "Activity", through: :followers, source: :activities

	has_many :lists, dependent: :destroy
	has_many :items, through: :lists

	has_many :bookmarks, dependent: :destroy
	has_many :bookmarked_items, through: :bookmarks, source: :meta_item

	has_many :group_relationships, dependent: :destroy
	has_many :groups, through: :group_relationships

	before_validation :clean_handle
	after_create :handle_token, if: :token?
	after_create :find_group_invites

	serialize :notification_settings, Hash

	include PgSearch::Model
  	pg_search_scope :search, against: [:name, :handle]

  	def profile_picture_url
  		profile_picture.service_url if profile_picture.attached?
  	end

	def clean_handle
		split = self.handle.downcase.gsub('-', '_').gsub(' ', '_').split('').select do |l|
			HANDLE_WHITELIST.include?(l)
		end
		self.handle = split.join('')
		
		if User.where(handle: self.handle).where.not(id: id).count > 0
			count = 1
			while User.find_by(handle: "#{self.handle}_#{count}")
				count += 1
			end
			self.handle = "#{self.handle}_#{count}"
		end
	end

	def created_at_string
		Date::MONTHNAMES[self.created_at.month] + " " + self.created_at.year.to_s
	end

	def self.index
		User.all.map do |user|
			item_count = user.lists.sum do |list|
				list.items.count
			end
			{
				name: user.name,
				link: user.link,
				lists: user.lists.count,
				items: item_count,
				twitter: user.twitter_handle,
			}
		end
	end

	def update_profile_picture(image)
		self.profile_picture.attach(data: image)
	end
	
	def admin?
		self.admin
	end

	def lists
		List.where(user_id: self.id).order(index: :asc)
	end

	def re_index_lists!
		lists.each_with_index do |list, index|
			list.index = index
			list.save
		end
	end

	def update_list_index!(lists)
		lists.each do |list_rams|
			list = List.find(list_rams[:id])
			list.index = list_rams[:index]
			list.save
		end
	end

	def list_index(bis=[])
		lists.map { |list| list.to_res(bis) }
	end

	def uncreated_lists
		my_list_strings = lists.map do |list|
			list.type.downcase
		end
		all_list_strings.filter do |list_string|
			!my_list_strings.include?(list_string)
		end
	end

	def group_index(admin: false, grps: [])
		gs = groups.where("group_relationships.accepted = true").map do |group|
			res = group.to_index_res(grps)
			res[:invite] = false
			res
		end

		if admin
			invites = groups.where("group_relationships.accepted = false").map do |group|
				res = group.to_index_res(grps)
				res[:invite] = true
				res
			end
			invites.concat(gs)
		else
			gs
		end
	end

	def to_res(current_user=nil, admin: false)
		bis = current_user&.bookmarked_items&.pluck(:id) || []
		flwing = current_user&.following&.pluck(:id) || []
		grps = current_user&.groups&.pluck(:id) || []
		{
			id: self.id,
			name: self.name,
			created: created_at_string,
			handle: self.handle,
			description: self.description,
			profile_picture_url: profile_picture_url,
			tabs: [
				{
					tab: 'feed',
					icon: 'fa-solid fa-newspaper',
					sub_tabs: [
						{
							type: 'feed',
							items: feed(following: flwing, bookmarks: bis),
						}
					],
				},
				{
					tab: 'lists',
					icon: 'fa-solid fa-clipboard-list',
					sub_tabs: list_index(bis),
				},
				{
					tab: 'circle',
					icon: 'fa-solid fa-circle-notch',
					sub_tabs: [
						{
							type: 'following',
							items: following.map { |u| u.to_index_res(flwing) },
						},
						{
							type: 'followers',
							items: followers.map { |u| u.to_index_res(flwing) },
						},
						{
							type: 'groups',
							items: group_index(admin: admin, grps: grps),
						}
					],
				},
				{
					tab: 'bookmarks',
					icon: 'fa-regular fa-bookmark',
					sub_tabs: [
						{
							type: 'bookmarks',
							items: bookmarked_items.map { |i| i.to_index_res(bis) },
							read_only: true,
						}
					],
				},
				{
					tab: 'discover',
					icon: 'fa-regular fa-compass',
					sub_tabs: [
						{
							type: 'users',
							items: discover_users_index(flwing: flwing),
							read_only: true,
						},
						{
							type: 'items',
							items: discover_items_index(bis: bis),
							read_only: true,
						},
						{
							type: 'groups',
							items: discover_groups_index(grps: grps),
							read_only: true,
						}
					]
				}
			],
			uncreated_lists: uncreated_lists,
			liked: flwing.include?(self.id),
			email: self.email,
			confirm_email: !self.email_confirmed && confirm_email,
			notification_settings: notification_settings,
		}
	end

	def subscribed?(type)
		self.notification_settings[type] == "1"
	end

	def to_index_res(flwing=[], index=nil, show_count=false)
		{
			id: self.id,
			index: index,
			title: self.name,
			url:  ENV["DOMAIN"] + '/' + self.handle,
			internal_url: true,
			image_url: profile_picture_url,
			followed: flwing.include?(self.id),
			count: show_count ? follower_count : nil,
			button: 'follow',
		}
	end

	def discover_users_index(offset: 0, flwing: nil)
		flwing ||= following&.pluck(:id) || []
		User.order(follower_count: :desc, id: :asc).offset(offset).limit(100).each_with_index.map do |u, i| 
			u.to_index_res(flwing, offset + i, true)
		end
	end

	def discover_items_index(offset: 0, bis: nil)
		bis ||= bookmarked_items&.pluck(:id) || []
		MetaItem.order(count: :desc, id: :asc).offset(offset).limit(100).each_with_index.map do |item, i| 
			item.to_index_res(bis, offset + i, true)
		end
	end

	def discover_groups_index(grps: nil)
		grps ||= groups&.pluck(:id) || []
		Group.where(private: false).order(member_count: :desc, id: :asc).each_with_index.map do |group, i|
			group.to_index_res(grps, i)
		end
	end

	def search_people(term, page: 1)
		twitter_client.user_search(term, count: 20, page: page).map do |twitter_user|
			reduce_user(twitter_user)
		end
	end

	def twitter_client
		if self.twitter_token
			Twitter::REST::Client.new do |config|
			  	config.consumer_key        = ENV["TWITTER_KEY"]
			  	config.consumer_secret     = ENV["TWITTER_SECRET_KEY"]
			  	config.access_token        = self.twitter_token
			  	config.access_token_secret = self.twitter_secret
			end
		end
	end

	def reduce_user(twitter_user)
		{
			uid: twitter_user.id.to_s,
			title: twitter_user.name,
			url_copy: '@' + twitter_user.screen_name,
			url: twitter_user.uri.to_s,
			image_url: twitter_user.profile_image_url.to_s.sub('_normal', ''),
			description: twitter_user.description,
		}
	end

	def link
		ENV["DOMAIN"] + "/" + self.handle
	end

	def meta_items_ids
		items.pluck(:meta_item_id)
	end

	private

	def confirm_email
		true
	end

	def handle_token
		token = Token.get(self.token)
		GroupRelationship.find_or_create_by(
			user: self,
			group_id: token[:group_id]
		)
		Token.destroy(self.token)
	end

	def find_group_invites
		gis = GroupInvite.where(email: self.email)
		gis.each do |gi|
			GroupRelationship.find_or_create_by(
				user: self,
				group: gi.group,
			)
		end
		gis.destroy_all
	end
end