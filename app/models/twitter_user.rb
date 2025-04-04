class TwitterUser < User 
	before_create :add_name_and_description
	before_update :add_name_and_description
	before_create :add_profile_picture_url
	before_create :add_email

	def add_profile_picture_url
		if !self.profile_picture.attached?
			url = twitter_client.user.profile_image_url.to_s.sub('_normal', '')
			data = encode_image_url(url)
			if data
				self.profile_picture.attach(data: data)
			end
		end
	end

	def add_profile_picture_url!
		url = twitter_client.user.profile_image_url.to_s.sub('_normal', '')
		data = encode_image_url(url)
		if data
			self.profile_picture.attach(data: data)
		end
	end

	private

	def add_name_and_description
		self.name = twitter_client.user.name if !self.name
		self.description = twitter_client.user.description if !self.description
		self.twitter_handle = twitter_client.user.screen_name
	end

	def confirm_email
		false
	end

	def add_email
		self.email = self.twitter_client.verify_credentials(include_email: true)[:email]
	end

	def all_list_strings
		%w(books podcasts articles videos people)
	end
end