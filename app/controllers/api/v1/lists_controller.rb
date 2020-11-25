class Api::V1::ListsController < ApplicationController
	before_action :set_list, except: [:create]

	def create
		list = List.create!(list_params)
		render json: {
			user: current_user.to_res
		}
	end

	def destroy
		@list.destroy!
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