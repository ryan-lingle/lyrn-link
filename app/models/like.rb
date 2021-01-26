class Like < ApplicationRecord
  belongs_to :like, class_name: "User"
  belongs_to :link, class_name: "User"
  validates_uniqueness_of :like_id, scope: [:link_id]
  validate :following_self
  before_create :increment_follower_count
  before_destroy :decrement_follower_count

  private

  def following_self
  	if like_id === link_id
  		raise "You cannot follow your self"
  	end
  end

  def increment_follower_count
  	link.follower_count += 1
  	link.save
  end

  def decrement_follower_count
  	link.follower_count -= 1
  	link.save
  end

end
