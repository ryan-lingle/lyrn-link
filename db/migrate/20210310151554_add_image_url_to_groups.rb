class AddImageUrlToGroups < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :image_url, :string
  end
end
