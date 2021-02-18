class CreateMetaItems < ActiveRecord::Migration[6.0]
  def change
    create_table :meta_items, id: :uuid do |t|
      t.string :title
      t.string :description
      t.string :url
      t.string :image_url
      t.string :creator
      t.string :subtitle
      t.string :uid
      t.string :url_copy
      t.text :categories
      t.date :publish_date
      t.integer :count, default: 1

      t.timestamps
    end
  end
end
