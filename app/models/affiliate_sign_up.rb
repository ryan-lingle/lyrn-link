class AffiliateSignUp < ApplicationRecord
	belongs_to :user, class_name: "User"
	belongs_to :affiliate , class_name: "User"
	validates_uniqueness_of :user_id, scope: [:affiliate_id ]
end
