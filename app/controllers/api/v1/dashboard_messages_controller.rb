require 'will_paginate/array'

module Api
  module V1
    class DashboardMessagesController < APIController
      before_action :web_token_authenticate!
      before_action :find_venue!
      before_action :find_dashboard_message!, except: [:create, :index]

      def index
        authorize!(:view, :dashboard_messages_page)

        dashboard_messages = (
          DashboardMessage.where(to_all_venues: true).includes([:created_by_user, :disabled_by_user]) + current_venue.dashboard_messages.includes([:created_by_user, :disabled_by_user])
        ).uniq.sort_by(&:published_time).reverse.paginate(page: page_number, per_page: 5)

        serialized_dashboard_messages = camelized_collection(
          dashboard_messages,
          Api::V1::DashboardMessageSerializer,
          { current_user: current_user },
          '**'
        )

        render json: {
          pageNumber: page_number,
          perPage: 5,
          totalCount: dashboard_messages.count,
          totalPages: (dashboard_messages.count + 5 - 1) / 5,
          dashboardMessages: serialized_dashboard_messages
        }
      end

      def update
        authorize! :edit, @dashboard_message

        update_dashboard_message = UpdateDashboardMessage.new(@dashboard_message, dashboard_message_params)

        if update_dashboard_message.update
          render json: update_dashboard_message.dashboard_message,
            serializer: Api::V1::DashboardMessageSerializer,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: update_dashboard_message.api_errors }
          )
        end
      end

      def create
        authorize! :create, DashboardMessage.new

        create_params = dashboard_message_params.merge(created_by_user: current_user)
        create_dashboard_message = CreateDashboardMessage.new(create_params)

        if create_dashboard_message.save
          render json: create_dashboard_message.dashboard_message,
            serializer: Api::V1::DashboardMessageSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: create_dashboard_message.api_errors }
          )
        end
      end

      def disable
        authorize! :disable, @dashboard_message

        if @dashboard_message.disable(current_user)
          render json: @dashboard_message,
            serializer: Api::V1::DashboardMessageSerializer,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: @dashboard_message }
          )
        end
      end

      def restore
        authorize! :enable, @dashboard_message

        if @dashboard_message.restore
          render json: @dashboard_message,
            serializer: Api::V1::DashboardMessageSerializer,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: @dashboard_message }
          )
        end
      end

      def page_number
        if params[:page].present?
          params[:page].to_i
        else
          1
        end
      end

      private

      def dashboard_message_params
        params.permit(:to_all_venues, :title, :message, :published_time, venue_ids: [])
      end

      def find_venue!
        @venue ||= Venue.find_by(id: params[:venue_id]) || AccessibleVenuesQuery.new(current_user).all.last
      end

      def find_dashboard_message!
        @dashboard_message ||= DashboardMessage.find(params.fetch(:id))
      end
    end
  end
end
