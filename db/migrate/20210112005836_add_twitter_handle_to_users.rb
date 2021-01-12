class AddTwitterHandleToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :twitter_handle, :string
  end
end
