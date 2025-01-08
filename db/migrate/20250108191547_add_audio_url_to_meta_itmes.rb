class AddAudioUrlToMetaItmes < ActiveRecord::Migration[6.0]
  def change
    add_column :meta_items, :audio_url, :string
    add_column :items, :audio_url, :string
  end
end
