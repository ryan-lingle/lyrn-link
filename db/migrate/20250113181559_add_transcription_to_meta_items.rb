class AddTranscriptionToMetaItems < ActiveRecord::Migration[6.0]
  def change
    add_column :meta_items, :transcription, :text
  end
end
