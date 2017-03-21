module Api
  module V1
    class StaffMembersController < APIController
      before_filter :web_token_authenticate!, only: [:show]
      before_filter :api_token_athenticate!, only: [:change_pin]

      def show
        staff_member = StaffMember.find(params.fetch(:id))
        authorize! :view, staff_member

        render locals: { staff_member: staff_member }
      end

      def change_pin
        staff_member = StaffMember.find(params.fetch(:id))

        authorize! :change_pin, staff_member

        pin_code = params.fetch(:pin_code)
        staff_member.update_attributes!(pin_code: pin_code)

        render nothing: true, status: :ok
      end
    end
  end
end
