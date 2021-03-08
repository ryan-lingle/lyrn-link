class Api::V1::GroupsController < ApplicationController
	skip_before_action :authenticate_request, only: [:show]

	def show
		group = Group.find_by(handle: params[:id])
		if !group
			render json: {}, status: 404
		else
			render json: {
				group: group.to_show_res,
			}
		end
	end

	def update
		group = Group.find(params[:id])
		authorize group
		group.update!(group_params)
		render json: {
			group: group.to_show_res,
		}
	end

	def create
		group = Group.new(group_params)
		group.clean_handle
		group.save!
		render json: {
			group: group.to_show_res,
		}
	end

	def destroy
		group = Group.find(params[:id])
		authorize group
		group.destroy!
		render json: {
			success: true,
		}
	end

	private

	def group_params
		params.require(:group).permit(:name, :description, :private).tap do |rams|
			rams[:user_id] = current_user.id
		end
	end
end