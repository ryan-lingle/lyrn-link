class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :item, null: false, polymorphic: true, type: :uuid
      t.text :text

      t.timestamps
    end
  end
end
