class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :item
  validates_uniqueness_of :item, scope: [:user]

end
