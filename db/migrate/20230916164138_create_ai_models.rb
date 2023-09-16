class CreateAiModels < ActiveRecord::Migration[6.0]
  def change
    create_table :ai_models, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.text :history

      t.timestamps
    end
  end
end
