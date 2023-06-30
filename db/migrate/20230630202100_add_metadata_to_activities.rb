class AddMetadataToActivities < ActiveRecord::Migration[6.0]
  def change
    add_column :activities, :metadata, :text
  end
end
