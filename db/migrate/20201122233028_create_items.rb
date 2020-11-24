class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items, id: :uuid do |t|
      t.string :title
      t.string :description
      t.string :url
      t.integer :index
      t.string :image
      t.text :authors
      t.references :list, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
