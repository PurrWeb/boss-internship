module Api
  module V1
    class StaffMembersController < APIController
      before_filter :web_token_authenticate!, only: [:show, :flagged]
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

      def flagged
        if required_flagged_staff_member_parameters_present?
          staff_members = FlaggedStaffMemberQuery.new(
            first_name: params.fetch("first_name").strip,
            surname: params.fetch("surname").strip,
            date_of_birth: Date.iso8601(params.fetch("date_of_birth")),
            email_address: params.fetch("email_address").strip,
            national_insurance_number: params.fetch("national_insurance_number").strip
          ).all

          render locals: { staff_members: staff_members }
        else
          render(
            json: {
              errors: { base: "required fields missing" }
            },
            status: 422
          )
        end
      end

      def self.required_flagged_staff_member_fields
        ["first_name", "surname", "date_of_birth", "email_address", "national_insurance_number"]
      end

      def required_flagged_staff_member_parameters_present?
        self.class.required_flagged_staff_member_fields.all? do |field|
          params.keys.include?(field)
        end
      end
    end
  end
end
