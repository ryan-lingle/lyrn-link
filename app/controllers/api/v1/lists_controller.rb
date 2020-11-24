class Api::V1::ListsController < ApplicationController
	def create
		list = List.create!(list_params)
		render json: {
			list: list.to_index_res,
		}
	end

	def show
		list = current_user.lists.find_by(type: params[:type].capitalize)
		render json: {
			list: list.to_show_res,
		}
	end

	def search
		list = current_user.lists.find_by(type: params[:type].capitalize)
		results = list.search(params[:term].to_s, offset: params[:offset])
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
end