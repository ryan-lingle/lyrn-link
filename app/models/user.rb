class User < ApplicationRecord
	# include ActiveStorageSupport::SupportForBase64
	# has_one_base64_attached :profile_picture

	# TODO: HANDLE USER VALIDATIONS
	# validates :username, :email, :password_digest, presence: true
	# validates :username, :email, uniqueness: true

	has_many :lists, dependent: :destroy

	before_create :add_name_and_description
	before_update :add_name_and_description

	before_create :add_profile_picture_url
	before_update :add_profile_picture_url

	def add_name_and_description
		self.name = twitter_client.user.name if !self.name
		self.description = twitter_client.user.description if !self.description
	end

	def add_profile_picture_url
		self.profile_picture_url = twitter_client.user.profile_image_url.to_s.sub('_normal', '') if !self.profile_picture_url
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

	def list_index
		lists.map { |list| list.to_res }
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

	def to_res
		{
			id: self.id,
			name: self.name,
			handle: self.handle,
			description: self.description,
			email: self.email,
			profile_picture_url: self.profile_picture_url,
			lists: list_index,
			uncreated_lists: uncreated_lists,
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
			image: twitter_user.profile_image_url.to_s.sub('_normal', ''),
			description: twitter_user.description,
		}
	end
end