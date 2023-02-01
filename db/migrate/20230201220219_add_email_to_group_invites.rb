class AddEmailToGroupInvites < ActiveRecord::Migration[6.0]
  def change
    add_column :group_invites, :email, :string
    remove_reference :group_invites, :user, null: false, foreign_key: true, type: :uuid
  end
end
