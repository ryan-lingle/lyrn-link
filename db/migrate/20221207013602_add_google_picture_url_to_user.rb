class AddGooglePictureUrlToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :google_picture_url, :string
  end
end
