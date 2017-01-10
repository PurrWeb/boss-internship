module Api
  module V1
    class PoolHallController < ActionController::Base
      def sync
        authenticate_or_request_with_http_token do |supplied_token, other_options|
          api_key = ApiKey.active.pool_hall.find_by(key: supplied_token)

          if !api_key.present?
            render(
              json: { errors: "Not authenticated" },
              status: 401
            )
            return
          end

          if !sync_fields_present?
            render json: {}, status: 401
            return
          end

          ActiveRecord::Base.transaction do
            UpdatePoolLoftTableSessionsFromJson.call(
              json: sync_table_sessions_from_params,
              nested: true
            )
          end

          render json: {}, status: 200
        end
      end

      def sync_fields_present?
        !!(sync_table_sessions_from_params &&
          sync_table_session_duration_edits_from_params)
      end

      def sync_table_sessions_from_params
        JSON.parse(params["table_sessions"])
      end

      def sync_table_session_duration_edits_from_params
        JSON.parse(params["table_session_duration_edits"])
      end
    end
  end
end
