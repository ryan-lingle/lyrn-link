class CreateAffiliateSignUps < ActiveRecord::Migration[6.0]
  def change
    create_table :affiliate_sign_ups, id: :uuid do |t|
      t.references :user, index: true, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.references :affiliate, index: true, null: false, foreign_key: { to_table: :users }, type: :uuid

      t.timestamps
    end
  end
end
