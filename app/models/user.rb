class User < ApplicationRecord
	include ActiveStorageSupport::SupportForBase64
	validates :username, :email, :password_digest, presence: true
	validates :username, :email, uniqueness: true
	has_many :password_resets, dependent: :destroy
	has_one_base64_attached :profile_picture
	has_secure_password

	def to_res
		{
			id: self.id,
			username: self.username,
			email: self.email,
			profile_picture_url: profile_picture_url,
		}
	end

	def profile_picture_url
	    self.profile_picture.variant(resize_to_limit: [100, 100]).processed.service_url if self.profile_picture.attachment
	end

	def intercom_hmac
		OpenSSL::HMAC.hexdigest(
		  'sha256',
		  ENV["INTERCOM_SECRET"],
		  self.id
		)
	end

	def super_admin?
		false
	end

	def admin?
		false
	end

	def partner?
		false
	end

	def employer?
		false
	end
end