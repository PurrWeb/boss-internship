Rails.application.routes.draw do
  devise_for :users, path: "auth", controllers: {
    sessions: 'users/sessions',
    confirmations: 'users/confirmations',
    unlocks: 'users/unlocks',
    passwords: 'users/passwords'
  }

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'

  resources :users, only: [:show, :index] do
    member do
      get :edit_access_details
      post :update_access_details
      get :edit_personal_details
      post :update_personal_details
      get :new_staff_member
      post :create_staff_member
    end
  end

  resources :invites, only: [:index, :new, :create] do
    member do
      post :revoke
      get :accept
      post :accept
    end
  end

  resources :staff_members, only: [:show, :index, :new, :create] do
    member do
      get :edit_employment_details
      post :update_employment_details
      get :edit_personal_details
      post :update_personal_details
      get :edit_avatar
      post :update_avatar
    end
  end

  resources :staff_types, only: [:index] do
    collection do
      post :update_colors
    end
  end

  resources :venues, only: [:index, :new, :create] do
    resources :rotas, only: [:show]
  end

  resources :rotas, only: [:index]

  resources :clock_in_clock_out, only: [:index]

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      resources :test, only: [] do
        collection do
          get :get
          post :post
        end
      end
      resources :venues, only: :show do
        resources :rotas, only: [] do
          member do
            get :overview
          end
          resources :rota_shifts,   only: [:create]
        end
      end
      resources :staff_members, only: :show
      resources :staff_types,   only: :show
      resources :rota_shifts,   only: [:show, :destroy, :update]
      resources :rotas,         only: :show do
        member do
          post :mark_in_progress
          post :mark_finished
        end
        collection do
          post :publish
        end
      end
    end
  end

  require "sidekiq/web"
  unless Rails.env.development?
    Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      username == "admin" && password == "60bde5437fdedsds9935d95c6c090"
    end
  end
  mount Sidekiq::Web, at: "/queue"

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
