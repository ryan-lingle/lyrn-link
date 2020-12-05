class Api::V1::AuthController < ApplicationController
	skip_before_action :authenticate_request

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
	    @user = User.find_or_create_by(twitter_id: id)
	    @user.twitter_token = res.token
	    @user.twitter_secret = res.secret
	    @user.handle = handle if !@user.handle
	    @user.save!
	    render json: {
	    	auth_token: new_jwt,
	    	user: @user.to_res
	    }
		    
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

end
