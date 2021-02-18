class BookmarkItemToMetaItem < ActiveRecord::Migration[6.0]
  def change
    remove_reference :bookmarks, :item, null: false, foreign_key: true, type: :uuid
  end
end
