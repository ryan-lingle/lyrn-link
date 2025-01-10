class AddRankToPodcasts < ActiveRecord::Migration[6.0]
  def change
    add_column :podcasts, :rank, :integer
  end
end
