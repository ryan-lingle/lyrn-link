class AddUserToGroups < ActiveRecord::Migration[6.0]
  def change
    add_reference :groups, :user, null: false, foreign_key: true, type: :uuid
  end
end
