class Recommendation < ApplicationRecord
  belongs_to :user
  belongs_to :meta_item
end
