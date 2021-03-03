class Api::V1::GroupsController < ApplicationController
	skip_before_action :authenticate_request, only: [:show]
	before_action :set_group, only: [:show]

	def show
		render json: {
			group: @group.to_show_res,
		}
	end

	private

	def group_params
		params.require(:group).permit(:meta_item_id).tap do |rams|
			rams[:user_id] = current_user.id
		end
	end

	def set_group
		@group = Group.find_by(handle: params[:id])
	end
end