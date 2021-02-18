class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :meta_item
  validates_uniqueness_of :meta_item, scope: [:user]

end
