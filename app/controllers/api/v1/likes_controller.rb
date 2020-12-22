class Api::V1::LikesController < ApplicationController
	def create
		like = Like.create!(like_params)
		count = Like.where(link_id: params[:id]).count
		render json: {
			liked: true
		}
	end

	def destroy
		Like.find_by(link_id: params[:id], like_id: current_user.id).destroy
		count = Like.where(link_id: params[:id]).count
		render json: {
			liked: false
		}
	end

	private

	def like_params
		params.require(:like).permit(:link_id).tap do |rams|
			rams[:like_id] = current_user.id
		end
	end
end