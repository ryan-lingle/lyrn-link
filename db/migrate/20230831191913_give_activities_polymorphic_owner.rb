class GiveActivitiesPolymorphicOwner < ActiveRecord::Migration[6.0]
  def change
    add_reference :activities, :owner, polymorphic: true, null: true, type: :uuid 

    Activity.all.each do |activity|
      activity.owner = activity.user
      activity.save
    end

    change_column_null :activities, :owner_id, false
    change_column_null :activities, :owner_type, false
  end
end
