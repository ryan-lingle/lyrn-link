class Like < ApplicationRecord
  belongs_to :like, class_name: "User"
  belongs_to :link, class_name: "User"
  validates_uniqueness_of :like_id, scope: [:link_id]
  validate :following_self

  def following_self
  	if like_id === link_id
  		raise "You cannot follow your self"
  	end
  end
end
