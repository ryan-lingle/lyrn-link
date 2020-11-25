class User < ApplicationRecord
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :profile_picture

	# TODO: HANDLE USER VALIDATIONS
	# validates :username, :email, :password_digest, presence: true
	# validates :username, :email, uniqueness: true

	has_many :lists, dependent: :destroy
	has_many :password_resets, dependent: :destroy

	def lists
		List.where(user_id: self.id).order(index: :asc)
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
			username: self.username,
			email: self.email,
			profile_picture_url: profile_picture_url,
			lists: list_index,
			uncreated_lists: uncreated_lists,
		}
	end

	def profile_picture_url
		twitter_client.user.profile_image_url.to_s.sub('_normal', '')
	end

	# def profile_picture_url
	#     self.profile_picture.variant(resize_to_limit: [100, 100]).processed.service_url if self.profile_picture.attachment
	# end

	def search_people(term, page: 1)
		twitter_client.user_search(term, count: 20, page: page).map do |twitter_user|
			reduce_user(twitter_user)
		end
	end

	private

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
			title: twitter_user.name,
			url: twitter_user.uri.to_s,
			image: twitter_user.profile_image_url.to_s.sub('_normal', ''),
		}
	end
end