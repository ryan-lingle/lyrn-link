class RecommendedItem < ApplicationRecord
    belongs_to :recommendation
    belongs_to :meta_item
end