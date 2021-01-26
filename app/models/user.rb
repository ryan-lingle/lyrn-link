class User < ApplicationRecord
	HANDLE_WHITELIST = %w(a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 _)
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :profile_picture

	validates :handle, presence: true, uniqueness: { case_sensitive: false }

	has_many :likes, class_name: "Like", foreign_key: "like_id"
	has_many :likers, class_name: "Like", foreign_key: "link_id"

	has_many :following, through: :likes, source: :link
	has_many :followers, through: :likers, source: :like

	has_many :lists, dependent: :destroy
	has_many :bookmarks, dependent: :destroy
	has_many :bookmarked_items, through: :bookmarks, source: :item

	before_validation :clean_handle
	before_update :clean_handle

	def clean_handle
		split = self.handle.downcase.gsub('-', '_').gsub(' ', '_').split('').select do |l|
			HANDLE_WHITELIST.include?(l)
		end
		self.handle = split.join('')
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
		self.profile_picture_url = ENV["S3_BUCKET"] + self.profile_picture.attachment.blob.key
		self.save
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

	def to_res(current_user=nil)
		bis = current_user&.bookmarked_items&.pluck(:id) || []
		flwing = current_user&.following&.pluck(:id) || []
		{
			id: self.id,
			name: self.name,
			created: created_at_string,
			handle: self.handle,
			description: self.description,
			profile_picture_url: profile_picture_url,
			lists: list_index(bis),
			circle: [
				{
					type: 'following',
					items: following.map { |u| u.to_index_res(flwing) },
				},
				{
					type: 'followers',
					items: followers.map { |u| u.to_index_res(flwing) },

				}
			],
			bookmarks: [{
				type: 'bookmarks',
				items: bookmarked_items.map { |i| i.to_index_res(bis) },
			}],
			discover: [{
				type: 'users',
				items: discover_index(flwing: flwing),
			}],
			uncreated_lists: uncreated_lists,
			liked: flwing.include?(self.id),
			email: self.email,
			confirm_email: !self.email_confirmed && confirm_email,
		}
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
			follower_count: show_count ? follower_count : nil,
		}
	end

	def discover_index(offset: 0, flwing: nil)
		flwing ||= following&.pluck(:id) || []
		User.order(follower_count: :desc, handle: :asc).offset(offset).limit(100).each_with_index.map do |u, i| 
			u.to_index_res(flwing, offset + i, true)
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

	private

	def confirm_email
		true
	end
end