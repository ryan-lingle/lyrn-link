class Api::V1::AuthController < ApplicationController
	skip_before_action :authenticate_request

	def sign_up
		@user = User.create!(user_params)

		if @user.valid?
			render json: {
		    	auth_token: new_jwt,
		    	user: @user.to_res
		    }
		else
	 		raise "Invalid email and/or password"
		end
	end

	def login
		@user = User.find_by(email: user_params[:email])
		if @user && @user.authenticate(user_params[:password])
	 		render json: {
		    	auth_token: new_jwt,
		    	user: @user.to_res
		    }
		else
	 		raise "Invalid email and/or password"
		end
	end

	def refresh_token
		decoded_refresh = JsonWebToken.decode(cookies[:refresh_token])
		# raise forbidden if missing or expired refresh token
		expires = decoded_refresh && decoded_refresh[:expires] && Time.parse(decoded_refresh[:expires])
		if !expires || Time.now > Time.parse(decoded_refresh[:expires])
			forbidden
			return
		end
		# handle missing user id error ???
		@user = User.find(decoded_refresh[:user_id])
		if @user
	 		render json: {
		    	auth_token: new_jwt,
		    	user: @user.to_res
		    }
		else
			forbidden
		end
	end

	def reset_password
		user = User.find_by(email: params[:email])
		raise "No user found with that email" if !user
		PasswordReset.create!(user: user)
		render json: { success: true }
	end

	def change_password
		password_reset = PasswordReset.find_by(token: params[:token])
		if !password_reset
			raise "Invalid token"
		else
			raise "Request has expired" if Time.now > password_reset.expire_at
			password_reset.user.password = params[:password]
			password_reset.user.save!
			password_reset.destroy!
			render json: { success: true }
		end
	end

	private

	def user_params
		params.require(:user).permit(:email, :password, :username)
	end
end
