class CreateLikes < ActiveRecord::Migration[6.0]
  def change
    create_table :likes, id: :uuid do |t|
      t.references :like, index: true, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.references :link, index: true, null: false, foreign_key: { to_table: :users }, type: :uuid

      t.timestamps
    end
  end
end
