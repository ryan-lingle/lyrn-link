Rails.application.routes.draw do
  root 'root#index'

  namespace 'api' do
  	namespace 'v1' do

      # AUTH ROUTES
  		post 'sign_up', to: 'auth#sign_up'
  		post 'login', to: 'auth#login'
  		post 'reset_password', to: 'auth#reset_password'
  		post 'change_password', to: 'auth#change_password'
  		get 'refresh_token', to: 'auth#refresh_token'
  		get 'current_user', to: 'users#show'

      # RESOURCES
      resources :users, only: [:update, :destroy] do
        member do
          post 'profile_picture', to: 'users#profile_picture'
        end
      end
    end
  end

  get '*path', to: 'root#index'
end
