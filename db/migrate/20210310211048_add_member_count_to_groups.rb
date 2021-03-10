class AddMemberCountToGroups < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :member_count, :integer, default: 0
  end
end
