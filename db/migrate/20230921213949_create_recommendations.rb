class CreateRecommendations < ActiveRecord::Migration[6.0]
  def change
    create_table :recommendations, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.date :date, null: false

      t.timestamps
    end

    create_table :recommended_items, id: :uuid do |t|
      t.references :recommendation, null: false, foreign_key: true, type: :uuid
      t.references :meta_item, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
