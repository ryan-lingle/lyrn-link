class Comment < ApplicationRecord
  include TimeSinceable
  belongs_to :user
  belongs_to :item, polymorphic: true

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
end
