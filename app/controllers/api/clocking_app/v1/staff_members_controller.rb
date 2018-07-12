module Api
  module ClockingApp
    module V1
      class StaffMembersController < ClockingAppController
        def change_pin
          result = UpdatePinCodeApiService.new(
            requester: current_staff_member,
            staff_member: staff_member_from_params
          ).call(pin_code: pin_code_from_params)

          if result.success?
            render json: {}, status: 200
          else
            render json: { errors: result.api_errors.errors }, status: 422
          end
        end

        private
        def staff_member_from_params
          StaffMember.enabled.find_by(id: params.fetch(:id))
        end

        def pin_code_from_params
          params.fetch(:pinCode)
        end
      end
    end
  end
end
