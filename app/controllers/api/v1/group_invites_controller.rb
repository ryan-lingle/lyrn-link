class Api::V1::GroupInvitesController < ApplicationController

	def create
		group = Group.find(group_invite_params[:group_id])
		authorize group if group.private
		user_with_email = User.find_by(email: group_invite_params[:email])
		if user_with_email
			gr = GroupRelationship.create!(
				user: user_with_email,
				group: group
			)
			user = gr.user.to_index_res
			user[:pending] = true
			render json: {
				user: user,
			}
		else
			gi = GroupInvite.create!(group_invite_params)
			render json: {
				email: gi.email,
			}
		end
		
		
	end

	private

	def group_invite_params
		params.require(:group_invite).permit(:group_id, :email)
	end
end