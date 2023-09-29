class Recommendation < ApplicationRecord
  belongs_to :user
  has_many :recommended_items, dependent: :destroy
  has_many :meta_items, through: :recommended_items

  def podcasts
    meta_items.where(media_type: 'podcast')
  end

  def books
    meta_items.where(media_type: 'book')
  end
end
