class AddMediaTypeToItems < ActiveRecord::Migration[6.0]
  def change
    add_column :items, :media_type, :string
    add_column :meta_items, :media_type, :string
  end
end
