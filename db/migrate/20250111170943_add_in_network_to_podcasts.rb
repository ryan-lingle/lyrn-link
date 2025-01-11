class AddInNetworkToPodcasts < ActiveRecord::Migration[6.0]
  def change
    add_column :podcasts, :in_network, :boolean
  end
end
