module Api
  module V1
    class SecurityShiftRequestsController < APIController
      before_filter :web_token_authenticate!

      def create
        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: SecurityShiftRequest.new,
        ).create(security_request_data_from_params)

        if result.success?
          render(
            json: {
              securityShiftRequest: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer.new(
                result.security_shift_request,
              ),
              permissions: SecurityShiftRequestsPermissions
                .new(current_user: current_user)
                .shift_request(request: result.security_shift_request)
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def destroy
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).destroy

        if result.success?
          render(
            json: {
              securityShiftRequest: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer.new(
                result.security_shift_request,
              ),
              permissions: SecurityShiftRequestsPermissions
                .new(current_user: current_user)
                .shift_request(request: result.security_shift_request)
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).update(security_request_data_from_params)

        if result.success?
          render(
            json: {
              securityShiftRequest: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer.new(
                result.security_shift_request,
              ),
              permissions: SecurityShiftRequestsPermissions
                .new(current_user: current_user)
                .shift_request(request: result.security_shift_request)
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def accept
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).accept

        if result.success?
          render(
            json: {
              securityShiftRequest: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer.new(
                result.security_shift_request,
              ),
              permissions: SecurityShiftRequestsPermissions
                .new(current_user: current_user)
                .shift_request(request: result.security_shift_request)
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def reject
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).reject(reject_reason: security_request_reject_reason_from_params)

        if result.success?
          render(
            json: {
              securityShiftRequest: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer.new(
                result.security_shift_request,
              ),
              permissions: SecurityShiftRequestsPermissions
                .new(current_user: current_user)
                .shift_request(request: result.security_shift_request)
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def undo
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).undo

        if result.success?
          render(
            json: {
              securityShiftRequest: Api::V1::SecurityShiftRequests::SecurityShiftRequestSerializer.new(
                result.security_shift_request,
              ),
              permissions: SecurityShiftRequestsPermissions
                .new(current_user: current_user)
                .shift_request(request: result.security_shift_request)
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def assign
        security_shift_request = security_request_from_params

        result = SecurityShiftRequestApiService.new(
          requester: current_user,
          security_shift_request: security_shift_request,
        ).assign(
          staff_member: staff_member_from_params,
          starts_at: starts_at_from_params,
          ends_at: ends_at_from_params,
        )

        if result.success?
          assigned_security_shift_request = result.security_shift_request
          assigned_rota_shift = assigned_security_shift_request.created_shift
          rota = assigned_rota_shift.rota
          render(
            json: {
              rotaShift: Api::V1::SecurityShiftRequests::RotaShiftSerializer.new(assigned_rota_shift),
              rota: Api::V1::SecurityShiftRequests::RotaSerializer.new(rota),
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      private

      def starts_at_from_params
        params.fetch(:startsAt)
      end

      def ends_at_from_params
        params.fetch(:endsAt)
      end

      def security_request_data_from_params
        {
          starts_at: starts_at_from_params,
          ends_at: ends_at_from_params,
          note: params.fetch(:note),
          venue: venue_from_params,
        }
      end

      def user_ability
        UserAbility.new(current_user)
      end


      def security_request_reject_reason_from_params
        params.fetch(:rejectReason)
      end

      def staff_member_from_params
        security_staff_types = StaffType.where(role: 'security')
        StaffMember
          .enabled
          .joins(:staff_type)
          .merge(security_staff_types)
          .uniq
          .find(params.fetch(:staffMemberId))
      end

      def security_request_from_params
        SecurityShiftRequest.find(params.fetch(:id))
      end

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params.fetch(:venueId))
      end

    end
  end
end
