class CreatePodcasts < ActiveRecord::Migration[6.0]
  def change
    create_table :podcasts, id: :uuid do |t|
      t.string :itunes_id
      t.text :description
      t.string :image_url
      t.string :rss_url
      t.string :title

      t.timestamps
    end
  end
end
