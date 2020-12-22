Rails.application.routes.draw do
  namespace 'api' do
  	namespace 'v1' do

      # AUTH ROUTES
  		post 'request_token', to: 'auth#request_token'
      post 'access_token', to: 'auth#access_token'
  		get 'refresh_token', to: 'auth#refresh_token'
      
  		get 'current_user', to: 'users#show'

      # RESOURCES
      resources :users, only: [:update, :destroy, :index] do
        member do
          post 'profile_picture', to: 'users#profile_picture'
        end
      end
      resources :lists, only: [:create, :destroy], param: :type do 
        collection do
          post 'index', to: 'lists#index'
        end
        member do
          post 'item_index', to: 'lists#item_index'
          get 'search', to: 'lists#search'
        end
        resources :items, only: [:create, :destroy]
      end
      resources :items, only: [] do
        collection do
          get 'scrape', to: 'items#scrape'
        end
      end

      resources :likes, only: [:create, :destroy]
      resources :bookmarks, only: [:create, :destroy]

    end
  end

  root to: 'root#root'
  get '*path', to: 'root#index'
end
