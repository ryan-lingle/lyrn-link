class CreateOauthCredentials < ActiveRecord::Migration[6.0]
  def change
    create_table :oauth_credentials, id: :uuid do |t|
      t.string :token
      t.string :secret

      t.timestamps
    end
  end
end
