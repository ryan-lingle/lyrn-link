class AddSecretToGroups < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :secret, :string
  end
end
