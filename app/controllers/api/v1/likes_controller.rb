class Api::V1::LikesController < ApplicationController
	skip_before_action :authenticate_request, only: [:show]
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

	def show
		count = Like.where(link_id: params[:id]).count
		if params[:authed].to_i
			authenticate_request
			liked = !!Like.find_by(link_id: params[:id], like_id: current_user.id)
		else
			liked = false
		end

		render json: {
			count: count,
			liked: liked,
		}
	end

	private

	def like_params
		params.require(:like).permit(:link_id).tap do |rams|
			rams[:like_id] = current_user.id
		end
	end
end