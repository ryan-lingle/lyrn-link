class Comment < ApplicationRecord
  include TimeSinceable
  belongs_to :user
  belongs_to :item, polymorphic: true
  after_create :send_notification_email
  after_create :send_conversation_notification_email

  def to_res
    {
      id: id,
      text: text,
      user: {
        id: user.id,
        profile_picture_url: user.profile_picture_url,
        handle: user.handle,
      },
      time_since: time_since,
    }
  end

  def action_url
    if item_type == 'Item'
      "#{ENV['DOMAIN']}/#{item.user.handle}/i/#{item.id}"
    else
      "#{ENV['DOMAIN']}/i/#{item.id}"
    end
  end

  def send_notification_email
    # Don't send to the user who created the comment
    if item_type == 'Item' && item.user != self.user && item.user.subscribed?('comment_on_my_item')
      NotificationMailer.new_comment(
        email: item.user.email,
        name: item.user.handle,
        comment: self,
      )
    end
  end

  def send_conversation_notification_email
    item.comment_users.each do |user|
      # Don't send to the user who created the comment or the user who created the item
      if user != self.user && (item_type == 'MetaItem' || user != item.user) && user.subscribed?('comment_on_my_converation')
        NotificationMailer.new_conversation_comment(
          email: user.email,
          name: user.handle,
          comment: self,
        )
      end
    end
  end
end
