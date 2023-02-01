class GroupInvite < ApplicationRecord
  belongs_to :group
  after_create :send_invite_email
  validates :email, presence: true, uniqueness: { scope: :group_id }

  private

  def send_invite_email
  	token = Token.create(metadata: { 
  		type: 'group_invite',
  		group_id: self.group_id,
  	})

  	GroupInviteMailer.send(
  		email: self.email,
  		group: group.name,
  		token: token.key,
  	)
  end
end
