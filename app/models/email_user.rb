class EmailUser < User
	has_secure_password
	validates :email, :password_digest, presence: true
	after_create :send_confirmation_email

	def send_confirmation_email
		token = Token.create(metadata: { user_id: self.id })
		PasswordConfirmationMailer.send(
			email: self.email,
			name: self.name,
			token: token.key,
		)
	end

	private

	def all_list_strings
		%w(books podcasts articles videos)
	end
end