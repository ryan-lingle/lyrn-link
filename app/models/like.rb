class Like < ApplicationRecord
  belongs_to :like, class_name: "User"
  belongs_to :link, class_name: "User"
  validates_uniqueness_of :like_id, scope: [:link_id]
end
