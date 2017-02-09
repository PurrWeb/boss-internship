module Api
  module V1
    class StaffMembersController < APIController
      before_filter :web_token_authenticate!, only: [:show, :create]
      before_filter :api_token_athenticate!, only: [:change_pin]

      def show
        staff_member = StaffMember.find(params.fetch(:id))
        authorize! :view, staff_member

        render locals: { staff_member: staff_member }
      end

      def create
        authorize! :manage, :staff_members

        result = CreateStaffMember.new(params: staff_member_params).call

        if result.success?
          flash[:success] = "Staff member added successfully"
          redirect_to action: :index
        else
          flash.now[:error] = "There was a problem creating this staff member"
          render 'new', locals: { staff_member: result.staff_member }
        end
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
