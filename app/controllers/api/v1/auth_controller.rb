class Api::V1::AuthController < ApplicationController
	skip_before_action :authenticate_request
	skip_before_action :verify_authenticity_token, only: :google

	def google
		validator = GoogleIDToken::Validator.new
		payload = validator.check(params["credential"], params["client_id"])
		@user = User.find_by(email: payload["email"])
		if !@user
			@user = GoogleUser.create!(reduce_google_payload(payload))
			create_affiliate_sign_up?(@user)
			create_group_relationship?(@user)
		end

		render json: {
			auth_token: new_jwt,
			user: @user.to_res
		}
	end

	def request_token
		if Rails.env == "development"
			callback_url = "http://localhost:3000/twitter/callback"
		else
			callback_url = "https://lyrn.link/twitter/callback"
		end
		
		res = OauthConsumer.get_request_token(oauth_callback: callback_url)
		OauthCredential.create!(
			token: res.token,
			secret: res.secret
		)
		render json: {
			token: res.token,
		}
	end

	def access_token
	    creds = OauthCredential.find_by(token: params[:oauth_token])
	    request_token  = OAuth::RequestToken.from_hash(OauthConsumer, creds.to_hash)
	    res = request_token.get_access_token(oauth_verifier: params[:oauth_verifier])
	    id = res.params[:user_id]
	    handle = res.params[:screen_name]
	    @user = TwitterUser.find_by(twitter_id: id)
	    if !@user
	    	@user = TwitterUser.create!(
	    		twitter_id: id,
	    		twitter_token: res.token,
	    		twitter_secret: res.secret,
	    		handle: handle,
	    		token: params["token"]
	    	)
	    	create_affiliate_sign_up?(@user)
	    	create_group_relationship?(@user)
	    else
	    	@user.twitter_token = res.token
	    	@user.twitter_secret = res.secret
	    	@user.save!
	    end
	    render json: {
	    	auth_token: new_jwt,
	    	user: @user.to_res
	    }
		    
  	end

  	def sign_up
  		@user = EmailUser.create!(user_params)
  		create_affiliate_sign_up?(@user)
  		create_group_relationship?(@user)
		render json: {
	    	auth_token: new_jwt,
	    	user: @user.to_res
	    }
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

	def reset_password_email
		@user = User.find_by(email: params[:email])
		if @user
			@user.send_reset_password_email
			render json: {
				success: true
			}
		else
			raise "No account found with that email"
		end
	end

	def reset_password
		token = Token.get(params[:token])
		@user = User.find(token[:user_id])
		if @user
			@user.update!(password: params[:password])
			Token.destroy(params[:token])
			render json: {
				success: true,
			}
		else
			raise "Invalid token"
		end
	end

	def sign_out
		cookies.delete(:refresh_token)
		render json: {
			success: true
		}
	end

	private

	def reduce_google_payload(payload)
		{
			email: payload['email'],
			name: payload['name'],
			handle: payload['name'],
			google_picture_url: payload['picture'],
			token: params['token'],
		}
	end

	def user_params
		params.require(:user).permit(:email, :password, :name, :handle, :token)
	end

	def create_affiliate_sign_up?(user)
		if params["affiliate"]
			affiliate = User.find_by(handle: params["affiliate"])
			if affiliate
				AffiliateSignUp.create!(
					user: user,
					affiliate: affiliate
				)
			end
		end
	end

	def create_group_relationship?(user)
		ap params["group_id"]
		if params["group_id"]
			GroupRelationship.create!(
				group_id: params["group_id"],
				user: user,
				accepted: true,
			)
		end
	end

end
