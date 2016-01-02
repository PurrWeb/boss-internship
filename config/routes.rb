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

  resources :users, only: [:show, :index]

  resources :invites, only: [:index, :new, :create] do
    member do
      post :revoke
      get :accept
      post :accept
    end
  end

  resources :staff_members, only: [:show, :index, :new, :create]

  resources :staff_types, only: [:index, :new]

  resources :venues, only: [:index, :create]

  resources :rotas, only: [] do
    collection do
      get :prefilled_example
      get :empty_example
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
