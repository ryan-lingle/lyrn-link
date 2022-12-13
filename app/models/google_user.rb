class GoogleUser < User 
	before_create :add_profile_picture_url

	def add_profile_picture_url
		if !self.profile_picture.attached? && self.google_picture_url
			data = encode_image_url(self.google_picture_url)
			if data
				self.profile_picture.attach(data: data)
			end
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

	def all_list_strings
		%w(books podcasts articles videos people)
	end
end