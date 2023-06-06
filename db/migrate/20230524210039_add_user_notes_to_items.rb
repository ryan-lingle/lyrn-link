class AddUserNotesToItems < ActiveRecord::Migration[6.0]
  def change
    add_column :items, :user_notes, :text
  end
end
