class CreateActivities < ActiveRecord::Migration[6.0]
  def change
    create_table :activities, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :type
      t.references :record, polymorphic: true, null: false, type: :uuid
      t.timestamps
    end
  end
end
