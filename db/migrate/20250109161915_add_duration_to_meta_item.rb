class AddDurationToMetaItem < ActiveRecord::Migration[6.0]
  def change
    add_column :meta_items, :duration, :integer
  end
end
