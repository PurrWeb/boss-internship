module Api
  module V1
    class StaffMembersController < APIController
      def show
        staff_member = StaffMember.find(params.fetch(:id))
        render locals: { staff_member: staff_member }
      end
    end
  end
end
