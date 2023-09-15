class AddDefaultValueToNotificationSettings < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :notification_settings, :text, default: { "comment_on_my_item": "1", "comment_on_my_converation": "1", "follow_post": "1", "new_follower": "1"}.to_yaml
  end
end
