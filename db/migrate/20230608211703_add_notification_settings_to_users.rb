class AddNotificationSettingsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :notification_settings, :text
  end
end
