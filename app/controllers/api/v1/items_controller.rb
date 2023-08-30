class Api::V1::ItemsController < ApplicationController
	skip_before_action :authenticate_request, only: [:show]
	before_action :set_list, except: [:scrape, :discover, :show, :update]

	def show
		item = Item.find_by(id: params[:id]) || MetaItem.find(params[:id])
		render json: {
			item: item.to_show_res(current_user&.bookmarked_items&.pluck(:id) || []),
		}
	end

	def create
		item = Item.create!(item_params)
		render json: {
			item: item.to_index_res,
		}
	end

	def update
		item = Item.find(params[:id])
		authorize item
		item.update!(item_params)
		render json: {
			item: item.to_show_res,
		}
	end

	def destroy
		item = Item.find(params[:id])
		authorize item
		item.destroy!
		@list.re_index_items!
		render json: {
			owner: @list.owner.to_res,
			owner_type: @list.owner.owner_type,
		}
	end

	def scrape
		doc = Nokogiri::HTML.parse(URI.open(params[:url], 'User-Agent' => 'lyrn-link'))
		image_meta = doc.at('meta[property="og:image"]')
		title_meta = doc.at('meta[property="og:title"]')
		description_meta = doc.at('meta[property="og:description"]')
		render json: {
			image: image_meta && image_meta["content"],
			title: title_meta && title_meta["content"],
			description: description_meta && description_meta["content"],
		}
	end

	def discover
		render json: {
			items: current_user.discover_items_index(offset: params[:offset].to_i)
		}
	end

	private

	def set_list
		@list = List.find(params[:list_id])
	end

	def item_params
		params.require(:item).permit(:uid, :title, :description, :url, :url_copy, :subtitle, :image_url, :creator, :subtitle, :publish_date, :categories, :user_notes).tap do |rams|
			if @list
				rams[:list] = @list
			end
		end
	end
end