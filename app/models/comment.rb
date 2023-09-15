class Comment < ApplicationRecord
  include TimeSinceable
  belongs_to :user
  belongs_to :item, polymorphic: true
  after_create :send_notification_email
  after_create :send_conversation_notification_email
  after_create :create_activity

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
    item.href
  end

  def send_notification_email
    # Don't send to the user who created the comment
    if item_type == 'Item' && item.owner_user != self.user && item.owner_user&.subscribed?('comment_on_my_item') && user.email.present?
      NotificationMailer.new_comment(
        email: item.owner_user.email,
        name: item.owner_user.handle,
        comment: self,
      )
    end
  end

  def send_conversation_notification_email
    item.comment_users.each do |user|
      # Don't send to the user who created the comment or the user who created the item
      if user != self.user && (item_type == 'MetaItem' || user != item.owner_user) && user.subscribed?('comment_on_my_converation') && user.email.present?
        NotificationMailer.new_conversation_comment(
          email: user.email,
          name: user.handle,
          comment: self,
        )
      end
    end
  end

  def create_activity
    CommentActivity.create!(
      owner: user,
      record: item,
      metadata: { comment: text }
    )
  end
end
