class GroupInvite < ApplicationRecord
  belongs_to :user
  belongs_to :group
end
