Rails.application.routes.draw do
  root 'root#index'

  namespace 'api' do
  	namespace 'v1' do

      # AUTH ROUTES
  		post 'request_token', to: 'auth#request_token'
      post 'access_token', to: 'auth#access_token'
  		get 'refresh_token', to: 'auth#refresh_token'
      
  		get 'current_user', to: 'users#show'

      # RESOURCES
      resources :users, only: [:update, :destroy] do
        member do
          post 'profile_picture', to: 'users#profile_picture'
        end
      end
      resources :lists, only: [:create, :destroy], param: :type do 
        member do
          get 'search', to: 'lists#search'
        end
        resources :items, only: [:create]
      end
      resources :items, only: [] do
        collection do
          get 'scrape', to: 'items#scrape'
        end
      end
    end
  end

  get '*path', to: 'root#index'
end
