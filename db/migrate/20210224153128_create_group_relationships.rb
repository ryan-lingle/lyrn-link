class CreateGroupRelationships < ActiveRecord::Migration[6.0]
  def change
    create_table :group_relationships, id: :uuid do |t|
      t.references :group, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
