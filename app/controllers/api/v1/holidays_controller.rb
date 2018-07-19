module Api
  module V1
    class HolidaysController < APIController
      before_filter :web_token_authenticate!

      def index
        query = StaffMember.where(id: params.fetch(:staff_member_id))
        query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
        staff_member = query.first
        raise ActiveRecord::RecordNotFound.new unless staff_member.present?
        if can? :edit, staff_member
          tax_year = TaxYear.new(RotaShiftDate.to_rota_date(Time.current))

          holiday_start_date = holiday_start_date_from_params
          holiday_end_date = holiday_end_date_from_params
          holiday_payslip_start_date = holiday_payslip_start_date_from_params
          holiday_payslip_end_date = holiday_payslip_end_date_from_params

          index_query = StaffMemberProfileHolidayIndexQuery.new(
            staff_member: staff_member,
            start_date: holiday_start_date,
            end_date: holiday_end_date,
            payslip_start_date: holiday_payslip_start_date,
            payslip_end_date: holiday_payslip_end_date
          )

          filtered_holidays = index_query.holidays.includes(:creator, holiday_request: [:creator])
          filtered_holiday_requests = index_query.holiday_requests.includes([:creator])

          holidays_in_tax_year = HolidayInTaxYearQuery.new(
           relation: staff_member.active_holidays,
           tax_year: tax_year,
           staff_member_start_date: staff_member.starts_at
          ).all.includes(:frozen_by)

          paid_holiday_days = holidays_in_tax_year.paid.to_a.sum { |holiday| holiday.days }
          unpaid_holiday_days = holidays_in_tax_year.unpaid.to_a.sum { |holiday| holiday.days }
          estimated_accrued_holiday_days = AccruedHolidayEstimate.new(
            staff_member: staff_member,
            tax_year: tax_year
          ).call

          access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

          staff_member_profile_permissions = StaffMemberProfilePermissions.new(
            staff_member: staff_member,
            current_user: current_user,
            holidays: filtered_holidays,
            holiday_requests: filtered_holiday_requests
          )

          render(
            json: {
              staff_member: Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member),
              access_token: access_token.token,
              holidays: ActiveModel::Serializer::CollectionSerializer.new(filtered_holidays, serializer: Api::V1::StaffMemberProfile::HolidaySerializer, scope: current_user),
              holiday_requests: ActiveModel::Serializer::CollectionSerializer.new(filtered_holiday_requests, serializer: Api::V1::StaffMemberProfile::HolidayRequestSerializer, scope: current_user),
              paid_holiday_days: paid_holiday_days,
              unpaid_holiday_days: unpaid_holiday_days,
              estimated_accrued_holiday_days: estimated_accrued_holiday_days,
              holiday_start_date: holiday_start_date && UIRotaDate.format(holiday_start_date),
              holiday_end_date: holiday_end_date && UIRotaDate.format(holiday_end_date),
              start_payslip_date: holiday_payslip_start_date && UIRotaDate.format(holiday_payslip_start_date),
              end_payslip_date: holiday_payslip_end_date && UIRotaDate.format(holiday_payslip_end_date),
              permissions_data: Api::V1::StaffMemberProfile::PermissionsSerializer.new(staff_member_profile_permissions)
            },
            status: :ok
          )
        else
          render(
            json: {},
            status: 422
          )
        end
      end

      def show
        holiday = Holiday.find(params[:id])

        render locals: { holiday: holiday }
      end

      def update
        staff_member = StaffMember.find(params.fetch(:staff_member_id))
        holiday = staff_member.holidays.find(params.fetch(:id))

        result = HolidayApiService.new(
          requester: current_user,
          holiday: holiday,
        ).update(holiday_update_params)

        if result.success?
          render(
            json: {
              holiday: Api::V1::StaffMemberProfile::HolidaySerializer.new(result.holiday, scope: current_user),
              permissions: {
                isEditable: can?(:edit, result.holiday),
                isDeletable: can?(:destroy, result.holiday)
              }
            },
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end

      end

      def destroy
        staff_member = StaffMember.find(params[:staff_member_id])
        holiday = staff_member.holidays.in_state(:enabled).where(id: params[:id]).first
        raise ActiveRecord::RecordNotFound unless holiday.present?

        result = HolidayApiService.new(
          requester: current_user,
          holiday: holiday,
        ).destroy

        if result.success?
          render(
            json: result.holiday,
            serializer: Api::V1::StaffMemberProfile::HolidaySerializer,
            scope: current_user,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def create
        staff_member = StaffMember.find(params.fetch(:staff_member_id))
        user_ability = UserAbility.new(current_user)

        result = HolidayApiService.new(
          requester: current_user,
          holiday: Holiday.new(staff_member: staff_member),
        ).create(holiday_create_params)

        if result.success?
          render(
            json: {
              holiday: Api::V1::StaffMemberProfile::HolidaySerializer.new(result.holiday, scope: current_user),
              permissions: {
                isEditable: user_ability.can?(:edit, result.holiday),
                isDeletable: user_ability.can?(:destroy, result.holiday)
              }
            },
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def holidays_count
        staff_member = StaffMember.find(params.fetch(:staff_member_id))
        tax_year = TaxYear.new(RotaShiftDate.to_rota_date(Time.current))

        holidays_in_tax_year = HolidayInTaxYearQuery.new(
          relation: staff_member.active_holidays,
          tax_year: tax_year,
           staff_member_start_date: staff_member.starts_at
         ).all.includes(:frozen_by)

         paid_holiday_days = holidays_in_tax_year.paid.to_a.sum { |holiday| holiday.days }
         unpaid_holiday_days = holidays_in_tax_year.unpaid.to_a.sum { |holiday| holiday.days }
         estimated_accrued_holiday_days = AccruedHolidayEstimate.new(
           staff_member: staff_member,
           tax_year: tax_year
         ).call

         render(
           json: {
            paidHolidayDays: paid_holiday_days,
            unpaidHolidayDays: unpaid_holiday_days,
            estimatedAccruedHolidayDays: estimated_accrued_holiday_days,
           },
           status: 200
         )
      end

      private
      def holiday_create_params
        {
          start_date: params.fetch(:start_date),
          end_date: params.fetch(:end_date),
          holiday_type: params.fetch(:holiday_type),
          note: params[:note]
        }
      end

      def holiday_update_params
        holiday_create_params.merge(
          payslip_date: params.fetch(:payslip_date),
        )
      end

      def holiday_start_date_from_params
        UIRotaDate.parse_if_present(params['start_date'])
      end

      def holiday_end_date_from_params
        UIRotaDate.parse_if_present(params['end_date'])
      end

      def holiday_payslip_start_date_from_params
        UIRotaDate.parse_if_present(params['payslip_start_date'])
      end

      def holiday_payslip_end_date_from_params
        UIRotaDate.parse_if_present(params['payslip_end_date'])
      end
    end
  end
end
