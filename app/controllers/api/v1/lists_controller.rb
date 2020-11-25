class Api::V1::ListsController < ApplicationController
	before_action :set_list, except: [:create, :index]

	def create
		list = List.create!(list_params)
		render json: {
			user: current_user.to_res
		}
	end

	def destroy
		@list.destroy!
		current_user.re_index_lists!
		render json: {
			user: current_user.to_res
		}
	end

	def index
		current_user.update_list_index!(params[:lists])
		render json: {
			user: current_user.to_res
		}
	end

	def item_index
		@list.update_item_index!(params[:items])
		render json: {
			user: current_user.to_res
		}
	end

	def search
		results = @list.search(params[:term].to_s, offset: params[:offset])
		render json: {
			results: results,
		}
	end

	private

	def list_params
		params.require(:list).permit(:type).tap do |rams|
			rams[:type] = rams[:type].capitalize
			rams[:user] = current_user
		end
	end

	def set_list
		@list = current_user.lists.find_by(type: params[:type].capitalize)
	end
end