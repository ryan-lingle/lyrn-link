class AddFollowerCountToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :follower_count, :integer, default: 0
  end
end
