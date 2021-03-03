class AddHandleToGroups < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :handle, :string
  end
end
