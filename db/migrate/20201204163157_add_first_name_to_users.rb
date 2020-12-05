class AddFirstNameToUsers < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :username, :handle
    add_column :users, :name, :string
  end
end
