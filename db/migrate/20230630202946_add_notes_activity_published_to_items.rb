class AddNotesActivityPublishedToItems < ActiveRecord::Migration[6.0]
  def change
    add_column :items, :notes_activity_published, :boolean, default: false
  end
end
