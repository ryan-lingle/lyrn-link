class MakeListOwnerPolymorphic < ActiveRecord::Migration[6.0]
  def change
    add_reference :lists, :owner, polymorphic: true, null: true, type: :uuid 

    List.all.each do |list|
      list.owner = list.user
      list.save
    end

    change_column_null :lists, :owner_id, false
    change_column_null :lists, :owner_type, false
  end
end
