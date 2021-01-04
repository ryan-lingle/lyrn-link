class User < ApplicationRecord
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :profile_picture

	# TODO: HANDLE USER VALIDATIONS
	# validates :username, :email, :password_digest, presence: true
	# validates :username, :email, uniqueness: true

	has_many :likes, class_name: "Like", foreign_key: "like_id"
	has_many :likers, class_name: "Like", foreign_key: "link_id"

	has_many :following, through: :likes, source: :link
	has_many :followers, through: :likers, source: :like

	has_many :lists, dependent: :destroy
	has_many :bookmarks, dependent: :destroy
	has_many :bookmarked_items, through: :bookmarks, source: :item

	before_create :add_name_and_description
	before_update :add_name_and_description

	before_create :add_profile_picture_url

	def created_at_string
		Date::MONTHNAMES[self.created_at.month] + " " + self.created_at.year.to_s
	end

	def self.index
		User.all.map do |user|
			{
				name: user.name,
				link: user.link,
			}
		end
	end

	def add_name_and_description
		self.name = twitter_client.user.name if !self.name
		self.description = twitter_client.user.description if !self.description
	end

	def add_profile_picture_url
		if !self.profile_picture.attachment
			url = twitter_client.user.profile_image_url.to_s.sub('_normal', '')
			data = encode_image_url(url)
			self.profile_picture.attach(data: data)
		end
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

	def list_index(current_user=nil)
		lists.map { |list| list.to_res(current_user) }
	end

	def uncreated_lists
		all_list_strings = %w(books podcasts articles videos people)
		my_list_strings = lists.map do |list|
			list.type.downcase
		end
		all_list_strings.filter do |list_string|
			!my_list_strings.include?(list_string)
		end
	end

	def profile_picture_url
	    self.profile_picture.variant(resize_to_limit: [100, 100]).processed.service_url if self.profile_picture.attachment
	end

	def to_res(current_user=nil)
		{
			id: self.id,
			name: self.name,
			created: created_at_string,
			handle: self.handle,
			description: self.description,
			profile_picture_url: profile_picture_url,
			lists: list_index(current_user),
			circles: [
				{
					type: 'following',
					items: following.map { |u| u.to_index_res(current_user) },
				},
				{
					type: 'followers',
					items: followers.map { |u| u.to_index_res(current_user) },

				}
			],
			bookmarks: [{
				type: 'bookmarks',
				items: bookmarked_items.map { |i| i.to_index_res(current_user) },
			}],
			uncreated_lists: uncreated_lists,
			liked: followers.include?(current_user),
		}
	end

	def to_index_res(current_user=nil)
		{
			id: self.id,
			title: self.name,
			url:  ENV["DOMAIN"] + '/' + self.handle,
			internal_url: true,
			image_url: profile_picture_url,
			followed: followers.include?(current_user),
		}
	end


	def search_people(term, page: 1)
		twitter_client.user_search(term, count: 20, page: page).map do |twitter_user|
			reduce_user(twitter_user)
		end
	end

	def twitter_client
		Twitter::REST::Client.new do |config|
		  	config.consumer_key        = ENV["TWITTER_KEY"]
		  	config.consumer_secret     = ENV["TWITTER_SECRET_KEY"]
		  	config.access_token        = self.twitter_token
		  	config.access_token_secret = self.twitter_secret
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
end