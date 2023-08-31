class Activity < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :owner, polymorphic: true
  belongs_to :record, polymorphic: true

  validates :owner, presence: true
  validates :record, presence: true

  serialize :metadata, Hash

  before_create :destroy_any_previous_duplicates

  def destroy_any_previous_duplicates
    Activity.where(
      owner: owner,
      record: record,
      metadata: metadata,
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
      owner_type: owner.owner_type
		}
	end

  def group_activity?
    owner.is_a?(Group)
  end

end
