class RemovePasswordResets < ActiveRecord::Migration[6.0]
  def change
  	drop_table :password_resets
  end
end
