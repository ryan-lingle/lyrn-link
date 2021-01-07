class EmailUser < User
	has_secure_password
	validates :email, :password_digest, presence: true


	def all_list_strings
		%w(books podcasts articles videos)
	end
end