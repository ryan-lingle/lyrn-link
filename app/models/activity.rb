class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :record, polymorphic: true

  validates :user, presence: true
  validates :record, presence: true

  before_create :destroy_any_previous_duplicates

  def destroy_any_previous_duplicates
    Activity.where(
      user: user,
      record: record,
    ).destroy_all
  end

  def to_index_res(flwing=[])
		{
			id: self.id,
      icon: icon,
			index: false,
			html: html,
			image_url: image_url,
			href: href,
		}
	end

end
