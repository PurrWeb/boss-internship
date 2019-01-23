module Api
  module V1
    class StaffMembersController < APIController
      before_filter :web_token_authenticate!, except: [:change_pin, :set_password, :reset_password]
      before_filter :api_token_athenticate!, only: [:change_pin]
      skip_before_filter :parse_access_tokens, only: [:set_password, :reset_password]

      def index
        staff_members = StaffMember.enabled.limit(20)

        render json: {
          staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
            staff_members,
            serializer: Api::V1::StaffMemberProfile::StaffMembersListSerializer,
          ),
          staffTypes: ActiveModel::Serializer::CollectionSerializer.new(
            StaffType.all,
            serializer: Api::V1::StaffMemberProfile::StaffTypeSerializer,
          ),
          venues: ActiveModel::Serializer::CollectionSerializer.new(
            Venue.all,
            serializer: Api::V1::StaffMemberProfile::VenueSerializer,
          ),
        }, status: 200
      end

      def show
        staff_member = StaffMember.find_by(id: params[:id])
        accessible_pay_rate_ids = UserAccessiblePayRatesQuery.new(
          user: current_user,
          pay_rate: staff_member.pay_rate,
        ).page_pay_rates.map(&:id)

        render json: {
          staffMember: Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member),
          staffTypes: StaffType.all,
          venues: ActiveModel::Serializer::CollectionSerializer.new(
            Venue.all,
            serializer: Api::V1::StaffMemberProfile::VenueSerializer,
          ),
          payRates: ActiveModel::Serializer::CollectionSerializer.new(
            PayRate.all,
            serializer: Api::V1::StaffMemberProfile::PayRateSerializer,
            scope: current_user,
          ),
          genderValues: StaffMember::GENDERS,
        }
      end

      def set_password
        password = params.fetch(:password)
        password_confirmation = params.fetch(:passwordConfirmation)
        verification_token = params.fetch(:verificationToken)

        staff_member = StaffMember.enabled.find_by!(verification_token: verification_token)

        result = StaffMemberVerificationService.new(staff_member: staff_member).set_password_and_verify(
          password: password,
          password_confirmation: password_confirmation,
        )

        if result.success?
          render json: {}, status: 200
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def reset_password
        password = params.fetch(:password)
        password_confirmation = params.fetch(:passwordConfirmation)
        verification_token = params.fetch(:verificationToken)

        staff_member = StaffMember.enabled.find_by!(verification_token: verification_token)

        result = StaffMemberPasswordResetService.new(staff_member: staff_member).reset_password(
          password: password,
          password_confirmation: password_confirmation,
        )

        if result.success?
          render json: {}, status: 200
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def send_app_download_email
        staff_member = StaffMember.enabled.find(params[:staff_member_id])

        unless staff_member.present?
          return render json: {}, status: 404
        end

        mobile_app = MobileApp.enabled.find(params.fetch(:mobileAppId))
        endpoint = SendMobileAppDownloadEmailEndpoint.new(
          staff_member: staff_member,
          mobile_app: mobile_app,
        )
        authorize!(:use, endpoint)

        result = SendMobileAppDownloadEmail.new(staff_member: staff_member, mobile_app: mobile_app).call

        if result.success?
          render json: {sentAt: result.mobile_app_download_link_send.sent_at}, status: 200
        else
          render json: {}, status: 422
        end
      end

      def send_verification
        staff_member = StaffMember.enabled.find(params[:staff_member_id])

        unless staff_member.present?
          return render json: {}, status: 404
        end

        result = StaffMemberVerificationService.new(staff_member: staff_member).send_verification

        if result.success?
          render json: result.staff_member, serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer, status: 200
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def revoke_verification
        staff_member = StaffMember.enabled.find(params[:staff_member_id])
        authorize!(:edit, staff_member)

        StaffMemberVerificationService.new(staff_member: staff_member).drop_verification!

        render json: staff_member, serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer, status: 200
      end

      def resend_verification
        staff_member = StaffMember.enabled.find(params[:staff_member_id])

        unless staff_member.present?
          return render json: {}, status: 404
        end

        result = StaffMemberVerificationService.new(staff_member: staff_member).resend_verification

        if result.success?
          render json: result.staff_member, serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer, status: 200
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def mark_retake_avatar
        staff_member = StaffMember.find(params[:staff_member_id])
        authorize!(:mark_retake_avatar, staff_member)

        staff_member = MarkRetakeAvatar.new(requester: current_user, staff_member: staff_member).call

        render json: staff_member, serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer, status: 200
      end

      def create
        authorize! :create, :staff_members

        params_json = JSON.parse(request.body)

        api_params = AddStaffMemberApiCallParams.new(params_json: params_json, requester: current_user)

        model_params = api_params.
          model_params.
          merge(
          creator: current_user,
        )

        result = CreateStaffMember.new(requester: current_user, params: model_params).call

        if result.success?
          render json: {staff_member_id: result.staff_member.id}.to_json, status: 200
        else
          api_errors = AddStaffMemberApiErrors.new(staff_member: result.staff_member)
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: api_errors}
        end
      end

      def change_pin
        staff_member = StaffMember.find(params.fetch(:id))

        authorize! :change, :pin_code

        pin_code = params.fetch(:pin_code)
        staff_member.update_attributes!(pin_code: pin_code)

        render nothing: true, status: :ok
      end

      def disable
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user,
        ).disable({
          disable_reason: params.fetch("disable_reason"),
          never_rehire: params.fetch("never_rehire"),
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer,
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def enable
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user,
        ).enable(starts_at: params.fetch("startsAt"))

        if result.success?
          render(
            json: result.staff_member,
            serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer,
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def flagged
        if required_flagged_staff_member_parameters_present?
          staff_members = FlaggedStaffMemberQuery.new(
            first_name: params.fetch("first_name").strip,
            surname: params.fetch("surname").strip,
            date_of_birth: params.fetch("date_of_birth").present? ? Date.iso8601(params.fetch("date_of_birth")) : nil,
            email_address: params.fetch("email_address").strip,
            national_insurance_number: params.fetch("national_insurance_number").strip,
          ).all

          existing_profiles = []

          if params.fetch("email_address").strip.present? || params.fetch("national_insurance_number").strip.present?
            email = params.fetch("email_address").strip
            national_insurance_number = params.fetch("national_insurance_number").strip
            existing_profiles = StaffMembersExistingQuery.new(
              email: email,
              national_insurance_number: national_insurance_number,
            ).profiles
          end

          render json: staff_members,
                 each_serializer: FlaggedStaffMemberSerializer,
                 meta: {existing_profiles: existing_profiles},
                 adapter: :json, status: :ok
        else
          render(
            json: {
              errors: {base: "required fields missing"},
            },
            status: 422,
          )
        end
      end

      def update_avatar
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user,
        ).update_avatar({
          avatar_base64: params.fetch("avatar_base64"),
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer,
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def update_contact_details
        staff_member = StaffMember.find(params.fetch(:id))

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user,
        ).update_contact_details({
          phone_number: params.fetch("phoneNumber"),
          address: params.fetch("address"),
          postcode: params.fetch("postcode"),
          country: params.fetch("country"),
          county: params.fetch("county"),
          email_address: params.fetch("emailAddress"),
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer,
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def update_personal_details
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user,
        ).update_personal_details({
          gender: params.fetch(:gender),
          date_of_birth: params.fetch(:dateOfBirth),
          first_name: params.fetch(:firstName),
          surname: params.fetch(:surname),
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer,
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def update_employment_details
        staff_member = StaffMember.find(params[:id])

        result = StaffMemberApiUpdateService.new(
          staff_member: staff_member,
          requester: current_user,
        ).update_employment_details({
          national_insurance_number: params["nationalInsuranceNumber"],
          sage_id: params.fetch("sageId"),
          hours_preference_note: params["hoursPreferenceNote"],
          day_preference_note: params["dayPreferenceNote"],
          starts_at: params.fetch("startsAt"),
          employment_status: params.fetch("employmentStatus"),
          pay_rate_id: params.fetch("payRateId"),
          master_venue_id: params.fetch("masterVenue"),
          other_venue_ids: params.fetch("otherVenues"),
          staff_type_id: params.fetch("staffType"),
          allow_no_sage_id: true,
        })

        if result.success?
          render(
            json: result.staff_member,
            serializer: Api::V1::StaffMemberProfile::StaffMemberSerializer,
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
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

      private

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params[:venue_id])
      end
    end
  end
end
