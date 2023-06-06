Rails.application.routes.draw do
  namespace 'api' do
  	namespace 'v1' do

      # AUTH ROUTES
      post 'google', to: 'auth#google'
  		post 'request_token', to: 'auth#request_token'
      post 'access_token', to: 'auth#access_token'
      post 'sign_up', to: 'auth#sign_up'
      post 'login', to: 'auth#login'
  		get 'refresh_token', to: 'auth#refresh_token'
      post 'sign_out', to: 'auth#sign_out'
  		get 'current_user', to: 'users#show'

      # RESOURCES
      resources :users, only: [:update, :destroy, :index] do
        member do
          post 'profile_picture', to: 'users#profile_picture'
        end
        collection do 
          get 'search', to: 'users#search'
          post 'send_confirmation_email', to: 'users#send_confirmation_email'
          post 'confirm_email', to: 'users#confirm_email'
          get 'discover', to: 'users#discover'
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
      resources :items, only: [ :show, :update ] do
        collection do
          get 'scrape', to: 'items#scrape'
          get 'discover', to: 'items#discover'
        end
        member do
          post 'comments', to: 'comments#create'
        end
      end

      resources :likes, only: [:create, :destroy]
      resources :bookmarks, only: [:create, :destroy]
      resources :groups, only: [:show, :create, :update, :destroy] do
        member do
          get 'index', to: 'groups#index_show'
          post 'image', to: 'groups#image'
        end
      end
      resources :group_relationships, only: [:create, :update, :destroy]
      resources :group_invites, only: [:create, :update]

    end
  end

  root to: 'root#root'
  get '*path', to: 'root#index'
end
