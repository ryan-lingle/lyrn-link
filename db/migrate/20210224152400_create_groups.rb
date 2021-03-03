class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups, id: :uuid do |t|
      t.string :name
      t.string :description
      t.boolean :private, default: false

      t.timestamps
    end
  end
end
