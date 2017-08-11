module Api
  module V1
    class StaffMembersController < APIController
      before_filter :web_token_authenticate!, only: [:show, :create, :flagged]
      before_filter :api_token_athenticate!, only: [:change_pin]

      def show
        staff_member = StaffMember.find(params.fetch(:id))
        authorize! :view, staff_member

        render locals: { staff_member: staff_member }
      end

      def create
        authorize! :manage, :staff_members

        params_json = JSON.parse(request.body)

        api_params = AddStaffMemberApiCallParams.new(params_json: params_json, requester: current_user)

        model_params = api_params.
          model_params.
          merge(
            creator: current_user
          )

        result = CreateStaffMember.new(params: model_params).call

        if result.success?
          render json: { staff_member_id: result.staff_member.id }.to_json, status: 200
        else
          api_errors = AddStaffMemberApiErrors.new(staff_member: result.staff_member)
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: api_errors }
        end
      end

      def change_pin
        staff_member = StaffMember.find(params.fetch(:id))

        authorize! :change_pin, staff_member

        pin_code = params.fetch(:pin_code)
        staff_member.update_attributes!(pin_code: pin_code)

        render nothing: true, status: :ok
      end

      def disable
        staff_member = StaffMember.find(params[:id])
        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user
        ).disable({
          disable_reason: params.fetch("disable_reason"),
          never_rehire: params.fetch("never_rehire")
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: ::StaffMemberSerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def enable
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user
        ).enable({
          starts_at: params.fetch("starts_at"),
          staff_type_id: params.fetch("staff_type_id"),
          main_venue_id: params.fetch("main_venue_id"),
          pay_rate_id: params.fetch("pay_rate_id"),
          other_venue_ids: Array(params.fetch("other_venue_ids")),
          pin_code: params.fetch("pin_code"),
          gender: params.fetch("gender"),
          phone_number: params.fetch("phone_number"),
          date_of_birth: params.fetch("date_of_birth"),
          starts_at: params.fetch("starts_at"),
          national_insurance_number: params.fetch("national_insurance_number"),
          hours_preference_note: params["hours_preference_note"],
          avatar_base64: params["avatar_base64"],
          day_preference_note: params["day_preference_note"],
          employment_status: params.fetch("employment_status"),
          first_name: params.fetch("first_name"),
          surname: params.fetch("surname"),
          sia_badge_number: params["sia_badge_number"],
          sia_badge_expiry_date: params["sia_badge_expiry_date"],
          address: params.fetch("address"),
          postcode: params.fetch("postcode"),
          country: params.fetch("country"),
          county: params.fetch("county"),
          email_address: params.fetch("email_address")
        })

        if result.success?
          render(
            json: {},
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def enable
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user
        ).enable({
          starts_at: params.fetch("starts_at"),
          staff_type_id: params.fetch("staff_type_id"),
          main_venue_id: params.fetch("main_venue_id"),
          pay_rate_id: params.fetch("pay_rate_id"),
          other_venue_ids: Array(params.fetch("other_venue_ids")),
          pin_code: params.fetch("pin_code"),
          gender: params.fetch("gender"),
          phone_number: params.fetch("phone_number"),
          date_of_birth: params.fetch("date_of_birth"),
          starts_at: params.fetch("starts_at"),
          national_insurance_number: params.fetch("national_insurance_number"),
          hours_preference_note: params["hours_preference_note"],
          avatar_base64: params["avatar_base64"],
          day_preference_note: params["day_preference_note"],
          employment_status: params.fetch("employment_status"),
          first_name: params.fetch("first_name"),
          surname: params.fetch("surname"),
          sia_badge_number: params["sia_badge_number"],
          sia_badge_expiry_date: params["sia_badge_expiry_date"],
          address: params.fetch("address"),
          postcode: params.fetch("postcode"),
          country: params.fetch("country"),
          county: params.fetch("county"),
          email_address: params.fetch("email_address")
        })

        if result.success?
          render(
            json: {},
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def flagged
        if required_flagged_staff_member_parameters_present?
          staff_members = FlaggedStaffMemberQuery.new(
            first_name: params.fetch("first_name").strip,
            surname: params.fetch("surname").strip,
            date_of_birth: params.fetch("date_of_birth").present? ? Date.iso8601(params.fetch("date_of_birth")) : nil,
            email_address: params.fetch("email_address").strip,
            national_insurance_number: params.fetch("national_insurance_number").strip
          ).all

          existing_profiles = []

          if params.fetch("email_address").strip.present? || params.fetch("national_insurance_number").strip.present?
            email = params.fetch("email_address").strip
            national_insurance_number = params.fetch("national_insurance_number").strip
            existing_profiles = StaffMembersExistingQuery.new(
              email: email,
              national_insurance_number: national_insurance_number
            ).profiles
          end
          
          render json: staff_members,
                 each_serializer: FlaggedStaffMemberSerializer,
                 meta: { existing_profiles: existing_profiles },
                 adapter: :json, status: :ok
        else
          render(
            json: {
              errors: { base: "required fields missing" }
            },
            status: 422
          )
        end
      end

      def update_avatar
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user
        ).update_avatar({
          avatar_base64: params.fetch("avatar_base64")
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: ::StaffMemberSerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def update_contact_details
        staff_member = StaffMember.find(params.fetch(:id))

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user
        ).update_contact_details({
          phone_number: params.fetch("phone_number"),
          address: params.fetch("address"),
          postcode: params.fetch("postcode"),
          country: params.fetch("country"),
          county: params.fetch("county"),
          email_address: params.fetch("email_address") || ""
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: ::StaffMemberSerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def update_personal_details
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user
        ).update_personal_details({
          gender: params.fetch(:gender),
          date_of_birth: params.fetch(:date_of_birth),
          first_name: params.fetch(:first_name),
          surname: params.fetch(:surname)
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: ::StaffMemberSerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def update_employment_details
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user
        ).update_employment_details({
          national_insurance_number: params["national_insurance_number"],
          hours_preference_note: params["hours_preference_note"],
          day_preference_note: params["day_preference_note"],
          starts_at: params.fetch("starts_at"),
          employment_status: params.fetch("employment_status"),
          pay_rate_id: params.fetch("pay_rate_id"),
          master_venue_id: params.fetch("master_venue_id"),
          other_venue_ids: params.fetch("other_venue_ids") || [],
          staff_type_id: params.fetch("staff_type_id"),
          sia_badge_number: params["sia_badge_number"],
          sia_badge_expiry_date: params["sia_badge_expiry_date"]
        })
        
        if result.success?
          render(
            json: result.staff_member,
            serializer: ::StaffMemberSerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
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
