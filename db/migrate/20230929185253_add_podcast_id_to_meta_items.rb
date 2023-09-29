class AddPodcastIdToMetaItems < ActiveRecord::Migration[6.0]
  def change
    add_reference :meta_items, :podcast, null: true, foreign_key: true, type: :uuid
  end
end
