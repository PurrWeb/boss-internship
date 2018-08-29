Rails.application.routes.draw do
  boss_routes = proc do
    get "/", to: "welcome#index"

    # The priority is based upon order of creation: first created -> highest priority.
    # See how all your routes lay out with "rake routes".
    devise_for :users, path: "auth", controllers: {
                         sessions: "users/sessions",
                         confirmations: "users/confirmations",
                         unlocks: "users/unlocks",
                         passwords: "users/passwords",
                       }
    resources :wtl_cards, only: [:index]
    resources :wtl_clients, only: [:index]
    resources :security_venues, only: [:index]
    resources :security_shift_requests, only: [:index, :show], path: "security-shift-requests"
    resources :security_shift_request_reviews, only: [:index, :show], path: "security-shift-request-reviews"
    resources :ops_diaries, only: [:index], path: "ops-diaries"
    resources :accessories, only: [:index]
    resources :accessory_requests, only: [:index], path: "accessory-requests"
    resources :machines, only: [:index]
    resources :machine_refloats, only: [:index]

    resources :incident_reports, only: [:index]
    resources :check_lists, only: [:index]
    resources :check_list_submissions, path: "checklist_submissions", only: [:index]

    resources :maintenance, only: [:index]
    resources :marketing_tasks, only: [:index]

    resources :venue_health_check, only: [:index, :new]
    resources :venue_health_check_reports, only: [:show]

    resources :payment_uploads, only: [:index]

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

    resources :vouchers, only: [:index] do
      member do
        get :usages
      end
      collection do
        get :redeem
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

    resource :venue_dashboard, only: [:show]
    resource :message_board, only: [:show]
    resources :holidays, only: [:index, :edit, :update]
    resources :holiday_requests, only: [:index], path: "holiday-requests"

    resources :staff_members, only: [:show, :new, :index] do
      resources :hours_overview, only: :show
      collection do
        resources :set_password, only: :show do
          collection do
            get :success
            get :expired
            get :something_went_wrong
          end
        end
        resources :reset_password, only: :show do
          collection do
            get :success
            get :expired
            get :something_went_wrong
          end
        end
      end
      member do
        get :holidays
        get :payments
        get :profile
        get :owed_hours
        get :accessories
      end
    end

    resources :finance_reports, only: [:index, :show]

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

    resources :security_rotas, only: [:index, :show] do
      member do
        get :requests
      end
    end

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

    resources :staff_vetting, only: [:index]

    resources :incident_reports, only: [:index, :show]

    resources :api_keys, only: [:index, :create, :destroy]
    get "dev/secruity_app_sse_test", to: "sse_tests#secruity_app_sse_test", as: "secruity_app_sse_test_dev"

    resources :hours_confirmation, only: [:index] do
      collection do
        get :current
      end
    end

    resources :staff_tracking, only: [:index]

    resources :payroll_reports, only: [:index, :show]
    resources :daily_reports, only: [:index]
    resources :weekly_reports, only: [:index]

    resources :rollbar_error_test, only: [:index] do
      collection do
        get :asset_pipeline
      end
    end

    namespace :api, defaults: {format: "json"} do
      namespace :wtl do
        namespace :v1 do
          resources :wtl_clients, only: [:create], path: "clients"
        end
      end

      namespace :security_app, path: "security-app" do
        namespace :v1 do
          resources :init, only: :index
          resource :tests, only: [] do
            get :get
            post :post
          end
          resource :sessions, only: [] do
            post :new, path: "new"
            post :renew
            post :forgot_password, path: "forgot-password"
            get :ably_auth, path: "ably-auth"
          end
        end
      end

      namespace :clocking_app, path: "clocking-app" do
        namespace :v1 do
          resources :init, only: [] do
            collection do
              post :index
            end
          end

          resources :tests, only: [] do
            collection do
              get :get
              post :post
            end
          end

          resources :sessions, only: [] do
            collection do
              post :index
              get :ably_auth, path: "ably-auth"
            end
          end

          resources :clocking, only: [] do
            collection do
              post :clock_in, path: "clock-in"
              post :clock_out, path: "clock-out"
              post :start_break, path: "start-break"
              post :end_break, path: "end-break"
            end
          end

          resources :staff_members, only: [] do
            member do
              post :change_pin, path: "change-pin"
            end
          end

          resources :notes, only: [:create, :update, :destroy]
        end
      end

      namespace :v1 do
        get "version", to: "version#version"

        resources :wtl_cards, only: [:create] do
          member do
            post :disable
            post :enable
          end
        end

        resources :wtl_clients, only: [:update] do
          member do
            post :disable
            post :enable
          end
        end

        resources :venue_dashboard_forecasts, only: [:show]

        resources :security_venues, only: [:create, :update]

        resources :security_shift_requests, only: [:create, :update, :destroy], path: "security-shift-requests" do
          member do
            post :accept
            post :reject
            post :undo
            post :assign
          end
        end

        resources :finance_reports, only: [] do
          member do
            post :complete
            post :complete_multiply
          end
        end

        resources :security_venue_shifts, only: [:create, :update, :destroy], path: "security-venue-shifts"
        resources :security_rota_shifts, only: [:create, :update, :destroy], path: "security-rota-shifts"

        resources :staff_vetting, only: [] do
          collection do
            get :staff_without_email, path: "staff-without-email"
            get :staff_without_ni_number, path: "staff-without-ni-number"
            get :staff_without_address, path: "staff-without-address"
            get :staff_without_photo, path: "staff-without-photo"
            get :staff_with_expired_sia_badge, path: "staff-with-expired-sia-badge"
            get :staff_on_wrong_payrate, path: "staff-on-wrong-payrate"
            get :staff_with_bounced_email, path: "staff-with-bounced-email"
          end
        end

        resources :holiday_requests, only: [:create, :destroy, :update], path: "holiday-requests" do
          member do
            post :accept
            post :reject
          end
        end

        resources :accessory_requests, only: [:index, :create, :update, :destroy], path: "accessory-requests" do
          member do
            post :accept
            post :reject
            post :undo
            post :complete
            post :accept_refund, path: "accept-refund"
            post :reject_refund, path: "reject-refund"
            post :undo_refund, path: "undo-refund"
            post :complete_refund, path: "complete-refund"
            post :update_payslip_date
            post :update_refund_payslip_date
          end
        end
        resources :ops_diaries, only: [:index, :create, :update, :destroy], path: "ops-diaries" do
          member do
            post :enable
            post :disable
          end
        end
        resources :accessories, only: [:index, :create, :update, :destroy] do
          member do
            post :restore
          end
        end

        resources :check_lists, only: [:index, :create, :update, :destroy] do
          collection do
            post :submit
          end
        end

        resources :check_list_submissions, path: "checklist_submissions", only: [:index]

        resources :uploads
        resources :dashboard_messages do
          member do
            put :disable
            put :restore
          end
        end
        resources :maintenance_task_image_uploads
        resources :maintenance_tasks do
          member do
            post :change_status
            post :add_note
          end
        end
        resources :marketing_tasks do
          collection do
            post :add_general
            post :add_live_music
            post :add_sports
            post :add_artwork
          end

          member do
            post :notes
            put :edit_general
            put :edit_live_music
            put :edit_sports
            put :edit_artwork
            put :restore
            put :change_status
            put :assign_user
          end
        end

        resources :machines_refloats, only: [:index, :create]
        resources :machines, only: [:index, :show, :create, :update, :destroy] do
          member do
            post :restore
          end
        end

        resources :payments, only: [] do
          collection do
            post :upload_csv
          end
        end

        resources :incident_reports, only: [:index, :show, :create, :update, :destroy]

        resources :questionnaires do
          resources :questionnaire_responses
        end

        resources :vouchers, only: [:index, :create, :destroy] do
          member do
            post :redeem
          end
        end

        resources :test, only: [] do
          collection do
            get :get
            post :post
          end
        end

        resources :rota_weekly_day_data, only: [:index]
        resources :security_rota_overview, only: [:show]

        resources :venues, only: :show do
          resources :rota_forecasts, only: [:show] do
            member do
              get :weekly
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
            resources :rota_shifts, only: [:create]
          end
        end
        resources :holidays, only: :show
        resources :holiday_reports, only: :index
        resources :staff_members, only: [:show, :create] do
          post :send_app_download_email
          post :send_verification
          post :resend_verification
          post :revoke_verification
          resources :holidays, only: [:index, :update, :destroy, :create] do
            collection do
              get :holidays_count
            end
          end
          resources :payments, only: [:index]
          resources :staff_member_accessory_requests, only: [:create, :index], path: "accessory-requests" do
            member do
              post :refund_request, path: "refund"
              post :cancel_request, path: "cancel"
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
            post :set_password
            post :reset_password
          end
        end
        resources :staff_types, only: :show
        resources :rota_shifts, only: [:show, :destroy, :update]
        resources :rotas, only: :show
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
        resources "pool_hall", only: [] do
          collection do
            post :sync
          end
        end
      end
    end
  end

  require "sidekiq/web"
  authenticate :user, lambda { |u| u.has_effective_access_level?(AccessLevel.dev_access_level) } do
    mount Sidekiq::Web, at: "/queue"
  end

  security_app_routes = proc do
    get "privacy-policy", to: "pages#security_app_privacy_policy"
  end

  wtl_routes = proc do
    get 'verify', to: 'wtl/verify#verify', as: 'wtl_verify'
    get 'something-went-wrong', to: 'wtl/verify#something_went_wrong', as: 'wtl_something_went_wrong'
  end

  clock_routes = proc do
    get "/", to: "clock/clock_in_clock_out#index"

    resources :clock_in_clock_out, module: "clock", only: [:index]

    namespace :api, defaults: {format: "json"} do
      namespace :v1 do
        get "version", to: "version#version"

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

  if BooleanEnvVariable.new("USE_SUBDOMAINS").value
    constraints subdomain: /^([a-z0-9]+-+)?boss/, &boss_routes
    constraints subdomain: /^([a-z0-9]+-+)?clock/, &clock_routes
    constraints subdomain: /^([a-z0-9]+-+)?nsecurity-app/, &security_app_routes
    constraints subdomain: /^([a-z0-9]+-+)?wtl/, &wtl
  else
    scope "", &boss_routes
    scope "/clock", &clock_routes
    scope "/nsecurity_app", &security_app_routes
    scope '/wtl', &wtl_routes
  end

  root "welcome#index"
end
