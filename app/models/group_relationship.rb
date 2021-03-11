class GroupRelationship < ApplicationRecord
  belongs_to :group
  belongs_to :user
  validates_uniqueness_of :user_id, scope: [:group_id]
  after_create :increment_member_count
  after_update :increment_member_count
  after_destroy :decrement_member_count

  private

  def increment_member_count
    if self.accepted
    	group.member_count += 1
    	group.save
    end
  end

  def decrement_member_count
    if self.accepted
    	group.member_count -= 1
    	group.save
    end
  end
end
