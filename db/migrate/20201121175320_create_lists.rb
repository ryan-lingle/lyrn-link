class CreateLists < ActiveRecord::Migration[6.0]
  def change
    create_table :lists, id: :uuid do |t|
      t.string :type
      t.integer :index
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
