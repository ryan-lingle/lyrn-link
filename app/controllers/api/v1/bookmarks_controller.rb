class Api::V1::BookmarksController < ApplicationController
	skip_before_action :authenticate_request, only: [:show]

	def create
		bookmark = Bookmark.create!(bookmark_params)
		render json: {
			bookmarked: true
		}
	end

	def destroy
		Bookmark.find_by(item_id: params[:id], user_id: current_user.id).destroy
		render json: {
			bookmarked: false
		}
	end

	private

	def bookmark_params
		params.require(:bookmark).permit(:item_id).tap do |rams|
			rams[:user_id] = current_user.id
		end
	end
end