class Api::V1::ItemsController < ApplicationController
	before_action :set_list, except: [:scrape]

	def create
		item = Item.create!(item_params)
		render json: {
			item: item.to_index_res,
		}
	end

	def destroy
		item = Item.find(params[:id])
		item.destroy!
		@list.re_index_items!
		render json: {
			user: current_user.to_res
		}
	end

	def scrape
		doc = Nokogiri::HTML.parse(open(params[:url], 'User-Agent' => 'lyrn-link'))
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

	def set_list
		@list = current_user.lists.find_by(type: params[:list_type].capitalize)
	end

	def item_params
		params.require(:item).permit(:uid, :title, :description, :url, :url_copy, :subtitle, :image_url, :creator, :subtitle, :publish_date, :categories).tap do |rams|
			rams[:list] = @list
		end
	end
end