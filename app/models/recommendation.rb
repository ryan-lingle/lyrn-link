class Recommendation < ApplicationRecord
  belongs_to :user
  has_many :recommended_items, dependent: :destroy
  has_many :meta_items, through: :recommended_items
end
