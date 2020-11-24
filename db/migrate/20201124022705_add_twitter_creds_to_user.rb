class AddTwitterCredsToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :twitter_token, :string
    add_column :users, :twitter_secret, :string
    add_column :users, :twitter_id, :string

  end
end
