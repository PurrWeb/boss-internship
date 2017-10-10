Rails.application.routes.draw do
  boss_routes = proc do
    get '/', to: 'welcome#index'

    # The priority is based upon order of creation: first created -> highest priority.
    # See how all your routes lay out with "rake routes".
    devise_for :users, path: "auth", controllers: {
      sessions: 'users/sessions',
      confirmations: 'users/confirmations',
      unlocks: 'users/unlocks',
      passwords: 'users/passwords'
    }

    resources :incident_reports, only: [:index]
    resources :check_lists, only: [:index]
    resources :check_list_submissions, path: "checklist_submissions", only: [:index]

    resources :venue_health_check, only: [:index, :new]
    resources :venue_health_check_reports, only: [:show]

    resources :change_orders, only: [:index, :show, :edit, :update, :destroy] do
      collection do
        get :submitted
        put :update_current
      end
    end

    resources :fruit_orders, only: [:index, :edit, :update, :destroy] do
      collection do
        get :submitted
        put :update_current
      end
    end

    resources :users, only: [:show, :index, :destroy] do
      member do
        get :disable
        post :undestroy
        get :edit_access_details
        post :update_access_details
        get :edit_personal_details
        post :update_personal_details
        get :new_staff_member
        post :create_staff_member
      end
    end

    resources :names, only: [:index]

    resources :invites, only: [:index, :new, :create] do
      member do
        post :revoke
        get :accept
        post :accept
      end
    end

    resources :holidays, only: [:index, :edit, :update]
    resources :owed_hours, only: [:edit, :update]

    resources :staff_members, only: [:show, :new, :index] do
      resources :hours_overview, only: :show
      member do
        get :holidays
        get :profile
        get :owed_hours
      end
    end

    resources :finance_reports, only: [:index, :create] do
      collection do
        post :complete_multiple
      end
    end

    resources :yearly_reports, only: [:index] do
      collection do
        get :hour_report
      end
    end

    resources :staff_types, only: [:index] do
      collection do
        post :update_colors
      end
    end

    resources :rotas, only: [:index, :show]
    resources :venues, only: [:index, :new, :create, :edit, :update]

    resources :pay_rates, only: [:index, :new, :create, :edit, :update, :destroy] do
      member do
        get :staff_members
      end

      collection do
        post :create_admin
      end
    end

    resources :admin_pay_rates, only: [:new, :create]

    resources :security_rotas, only: [:index, :show]

    resources :change_order_reports, only: [:index, :show] do
      member do
        put :accept
      end

      collection do
        get :history
        put :complete
      end
    end

    resources :fruit_order_reports, only: [:index] do
      member do
        put :accept
      end

      collection do
        put :complete
        get :history
      end
    end

    resources :safe_checks, only: [:index, :new, :create, :show]

    resources :safe_check_notes, only: [:index, :create]

    resources :staff_vetting, only: [:index] do
      collection do
        get :staff_members_without_email
        get :staff_members_without_ni_number
        get :staff_members_without_address
        get :staff_members_without_photo
        get :staff_members_on_wrong_payrate
        get :staff_members_with_expired_sia_badge
      end
    end

    resources :incident_reports, only: [:index, :show]

    resources :api_keys, only: [:index, :create, :destroy]

    resources :hours_confirmation, only: [:index] do
      collection do
        get :current
      end
    end

    resources :staff_tracking, only: [:index]

    resources :payroll_reports, only: [:index]
    resources :daily_reports, only: [:index]
    resources :weekly_reports, only: [:index]

    resources :rollbar_error_test, only: [:index] do
      collection do
        get :asset_pipeline
      end
    end

    namespace :api, defaults: { format: 'json' } do
      namespace :v1 do
        get 'version', to: 'version#version'

        resources :check_lists, only: [:index, :create, :update, :destroy] do
          collection do
            post :submit
          end
        end

        resources :check_list_submissions, path: "checklist_submissions", only: [:index]

        resources :uploads

        resources :incident_reports, only: [:index, :show, :create, :update, :destroy]

        resources :questionnaires do
          resources :questionnaire_responses
        end

        resources :test, only: [] do
          collection do
            get :get
            post :post
          end
        end

        resources :rota_weekly_day_data, only: [:index]

        resources :venues, only: :show do
          resources :rota_forecasts, only: [:show] do
            member do
              get  :weekly
              post :update
            end
          end
          resources :rotas, only: [] do
            member do
              get :overview
              post :mark_in_progress
              post :mark_finished
            end
            collection do
              post :publish
            end
            resources :rota_shifts,   only: [:create]
          end
        end
        resources :holidays, only: :show
        resources :holiday_reports, only: :index
        resources :staff_members, only: [:show, :create] do
          resources :holidays, only: [:index, :update, :destroy, :create] do
            collection do
              get :holidays_count
            end
          end
          resources :owed_hours, only: [:index, :update, :destroy, :create]
          member do
            post :disable
            post :enable
            post :update_employment_details
            post :update_personal_details
            post :update_contact_details
            post :update_avatar
          end

          collection do
            post :flagged
          end
        end
        resources :staff_types,   only: :show
        resources :rota_shifts,   only: [:show, :destroy, :update]
        resources :rotas,         only: :show
        resources :sessions, only: [:create]
        resources :security_rotas, only: [] do
          member do
            get :overview
          end
        end
        resources :hours_acceptance_periods, only: [:create, :update, :destroy] do
          collection do
            post :clock_out
          end
        end
        resources 'pool_hall', only: [] do
          collection do
            post :sync
          end
        end
      end
    end
  end

  require "sidekiq/web"
  authenticate :user, lambda { |u| u.dev? } do
    mount Sidekiq::Web, at: "/queue"
  end

  clock_routes = proc do
    get '/', to: 'clock/clock_in_clock_out#index'

    resources :clock_in_clock_out, module: 'clock', only: [:index]

    namespace :api, defaults: { format: 'json' } do
      namespace :v1 do
        get 'version', to: 'version#version'

        resources :sessions, only: [:create]
        resources :clock_in_clock_out, only: [:index]

        resources :clocking, only: [] do
          collection do
            post :clock_in
            post :clock_out
            post :start_break
            post :end_break
            post :add_note
          end
        end

        resources :staff_members, only: [:create] do
          member do
            post :change_pin
          end

          collection do
            post :flagged
          end
        end
      end
    end
  end

  if ENV["USE_SUBDOMAINS"]
    constraints subdomain: /^([a-z0-9]+-+)?boss/, &boss_routes
    constraints subdomain: /^([a-z0-9]+-+)?clock/, &clock_routes
  else
    scope "", &boss_routes
    scope "/clock", &clock_routes
  end

  root 'welcome#index'
end
