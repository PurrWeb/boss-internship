module Api
  module ClockingApp
    module V1
      class StaffMembersController < ClockingAppController

        def change_pin
          result = PinCodeApiService.new(
            requester: staff_member_from_token,
            staff_member: staff_member_from_params
          ).update(pin_code: pin_code_from_params)

          if result.success?
            render json: {}, status: 200
          else
            render json: { errors: result.api_errors.errors }, status: 422
          end
        end

        private

        def staff_member_from_params
          StaffMember.find_by(id: params.fetch(:id))
        end

        def pin_code_from_params
          params.fetch(:pinCode)
        end
      end
    end
  end
end
