class AddMetaItemToBookmark < ActiveRecord::Migration[6.0]
  def change
    add_reference :bookmarks, :meta_item, null: true, foreign_key: true, type: :uuid
  end
end
