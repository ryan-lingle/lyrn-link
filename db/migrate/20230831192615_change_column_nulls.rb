class ChangeColumnNulls < ActiveRecord::Migration[6.0]
  def change
    change_column_null :lists, :user_id, true
    change_column_null :activities, :user_id, true
  end
end
