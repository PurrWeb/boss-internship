module Api
  module V1
    class StaffMembersController < APIController
      before_filter :web_token_authenticate!

      def show
        staff_member = StaffMember.find(params.fetch(:id))
        authorize! :view, staff_member

        render locals: { staff_member: staff_member }
      end
    end
  end
end
