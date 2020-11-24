class OauthCredential < ApplicationRecord
	def to_hash
		{
			oauth_token: self.token,
			oauth_token_secret: self.secret,
		}
	end
end
