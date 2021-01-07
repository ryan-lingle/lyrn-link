class EmailUser < User
	has_secure_password
	validates :email, :password_digest, presence: true
	after_create :send_confirmation_email

	def send_confirmation_email
		PasswordConfirmationMailer.send(
			email: self.email,
			name: self.name,
			token: 'test_token',
		)
	end

	private

	def all_list_strings
		%w(books podcasts articles videos)
	end
end