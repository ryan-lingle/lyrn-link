class AddAcceptedToGroupRelationships < ActiveRecord::Migration[6.0]
  def change
    add_column :group_relationships, :accepted, :boolean, default: false
  end
end
