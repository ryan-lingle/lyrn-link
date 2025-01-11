class AddRecProfileToMetaItems < ActiveRecord::Migration[6.0]
  def change
    add_column :meta_items, :rec_profile, :string
  end
end
