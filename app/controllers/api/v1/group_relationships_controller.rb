class Api::V1::GroupRelationshipsController < ApplicationController

	def update
		gr = current_user.group_relationships.find_by(group_id: params[:id])
		gr.update!(group_relationship_params)
		render json: {
			group: gr,
		}
	end

	def create
		gr = GroupRelationship.create!(group_relationship_params)
		user = gr.user.to_index_res
		user[:pending] = true
		render json: {
			user: user,
		}
	end

	def destroy
		gr = current_user.group_relationships.find_by(group_id: params[:id])
		gr.destroy!
		render json: { success: true }
	end

	private

	def group_relationship_params
		params.require(:group_relationship).permit(:group_id, :user_id, :accepted)
	end
end