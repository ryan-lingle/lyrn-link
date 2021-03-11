class Api::V1::GroupsController < ApplicationController
	skip_before_action :authenticate_request, only: [:show]

	def show
		group = Group.find_by(handle: params[:id])
		if !group
			render json: {}, status: 404
		else
			soft_authentication
			raise "You must be a member to view this group." if !group.users.include?(current_user)
			render json: {
				group: group.to_show_res(current_user),
				admin: group.user == current_user,
			}
		end
	end

	def update
		group = Group.find(params[:id])
		authorize group
		group.update!(group_params)
		render json: {
			group: group.to_show_res(current_user),
			admin: group.user == current_user,
		}
	end

	def create
		group = Group.new(group_params)
		group.clean_handle
		group.save!
		render json: {
			group: group.to_index_res(current_user.groups.pluck(:id)),
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

	def image
		group = Group.find(params[:id])
		authorize group
		group.update_image(params[:image])
		render json: {
			group: group.to_show_res(current_user),
		}
	end

	private

	def group_params
		params.require(:group).permit(:name, :description, :private, :handle).tap do |rams|
			rams[:user_id] = current_user.id
		end
	end
end