class AddColsToLists < ActiveRecord::Migration[6.0]
  def change
  	rename_column :items, :authors, :creator
  	add_column :items, :subtitle, :string
  	add_column :items, :url_copy, :string
  	add_column :items, :uid, :string
  	add_column :items, :categories, :text
  	add_column :items, :publish_date, :date
  end
end
