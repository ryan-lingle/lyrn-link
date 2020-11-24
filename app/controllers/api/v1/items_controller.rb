class Api::V1::ItemsController < ApplicationController

	def create
		@list = current_user.lists.find_by(type: params[:list_type].capitalize)
		item = Item.create!(item_params)
		render json: {
			item: item.to_index_res,
		}
	end

	def scrape
		doc = Nokogiri::HTML.parse(open(params[:url]))
		image_meta = doc.at('meta[property="og:image"]')
		title_meta = doc.at('meta[property="og:title"]')
		description_meta = doc.at('meta[property="og:description"]')
		render json: {
			image: image_meta && image_meta["content"],
			title: title_meta && title_meta["content"],
			description: description_meta && description_meta["content"],
		}
	end

	private

	def item_params
		params.require(:item).permit(:title, :description, :url, :image).tap do |rams|
			rams[:list] = @list
		end
	end
end