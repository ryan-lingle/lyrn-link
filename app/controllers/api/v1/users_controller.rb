class Api::V1::UsersController < ApplicationController
	skip_before_action :authenticate_request, only: [:show]
	before_action :set_user, except: [:show]

	def show
		if params[:username]
			user = User.find_by(username: params[:username])
			if !user
				render json: {}, status: 404
			else
				render json: {
					user: user.to_res
				}
			end
		else
			authenticate_request
			render json: {
				user: current_user.to_res 
			}
		end
	end

	def update
		authorize @user
		@user.update!(user_params)
		render json: {
			user: @user.to_res,
		}
	end

	def profile_picture
		authorize @user
		@user.profile_picture.attach(data: params[:image])
		render json: {
			user: @user.to_res,
		}
	end

	def destroy
		authorize @user
		@user.destroy!
		render json: {
			success: true
		}
	end

	private

	def user_params
		params.require(:user).permit(:email, :password, :username)
	end

	def set_user
		@user = User.find(params[:id])
	end
end
