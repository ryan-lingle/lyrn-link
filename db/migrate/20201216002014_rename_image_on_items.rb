class RenameImageOnItems < ActiveRecord::Migration[6.0]
  def change
  	rename_column :items, :image, :image_url
  end
end
