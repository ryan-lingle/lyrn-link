class Api::V1::UsersController < ApplicationController
	skip_before_action :authenticate_request, only: [:show, :confirm_email]
	before_action :soft_authentication, only: [:show]
	before_action :set_user, except: [:show, :index, :send_confirmation_email, :confirm_email, :discover, :search]

	def index
		authorize current_user
		render json: {
			count: User.count,
			users: User.index,
		}
	end

	def discover
		render json: {
			users: current_user.discover_users_index(offset: params[:offset].to_i)
		}
	end

	def search
		res = User.search(params[:term])
		render json: {
			results: res.map { |user| user.to_index_res }
		}
	end

	def show
		if params[:handle]
			user = User.find_by(handle: params[:handle].downcase)
			if !user
				render json: {}, status: 404
			else
				render json: {
					admin: false,
					user: user.to_res(current_user),
					current_user_id: current_user&.id,
					current_user_profile_picture: current_user&.profile_picture_url,
				}
			end
		elsif authenticate_request
			render json: {
				admin: true,
				user: current_user.to_res(current_user, admin: true),
				current_user_id: current_user.id,
				current_user_profile_picture: current_user.profile_picture_url,
			}
		end
	end

	def update
		authorize @user
		@user.update!(user_params)
		render json: {
			user: @user.to_res(current_user, admin: true),
			admin: true,
			current_user_id: current_user.id,
			current_user_profile_picture: current_user.profile_picture_url,
		}
	end

	def profile_picture
		authorize @user
		@user.update_profile_picture(params[:image])
		render json: {
			user: @user.to_res(current_user, admin: true),
			admin: true,
			current_user_id: current_user.id,
			current_user_profile_picture: current_user.profile_picture_url,
		}
	end

	def destroy
		authorize @user
		@user.destroy!
		render json: {
			success: true
		}
	end

	def send_confirmation_email
		current_user.send_confirmation_email
		render json: {
			success: true
		}
	end

	def confirm_email
		token = Token.get(params[:token])
		@user = User.find(token[:user_id])
		if @user
			@user.email_confirmed = true
			@user.save!
			Token.destroy(params[:token])
			render json: {
				token: new_jwt,
				user: @user.to_res
			}
		else
			render json: {
				error: true
			}
		end
	end

	private

	def user_params
		params.require(:user).permit(:email, :name, :handle, :description)
	end

	def set_user
		@user = User.find(params[:id])
	end
end
