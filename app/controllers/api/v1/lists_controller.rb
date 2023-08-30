class Api::V1::ListsController < ApplicationController
	before_action :set_list, only: [:destroy, :item_index, :search, :index]

	def create
		list = List.new(list_params)
		ListPolicy.new(current_user, list).create?
		list.save!
		render json: {
			owner: list.owner.to_res,
			owner_type: list.owner_type.downcase,
		}
	end

	def destroy
		ListPolicy.new(current_user, @list).destroy?
		@owner = @list.owner
		@list.destroy!
		@owner.re_index_lists!
		render json: {
			owner: @owner.to_res,
			owner_type: @list.owner_type.downcase,
		}
	end

	def index
		@list.owner.update_list_index!(params[:lists])
		render json: {
			owner: @list.owner.to_res,
			owner_type: @list.owner.owner_type,
		}
	end

	def item_index
		@list.update_item_index!(params[:items])
		render json: {
			owner: @list.owner.to_res,
			owner_type: @list.owner_type.downcase,
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
			rams[:owner_id] = params[:group_id] || current_user.id
			rams[:owner_type] = params[:group_id] ? 'Group' : 'User'
		end
	end

	def set_list
		@list = List.find(params[:id])
	end
end