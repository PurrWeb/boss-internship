module Api
  module V1
    class OwedHoursController < APIController
      before_filter :web_token_authenticate!

      def index
        query = StaffMember.where(id: params[:staff_member_id])
        query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
        staff_member = query.first

        raise ActiveRecord::RecordNotFound.new unless staff_member.present?
        authorize! :edit, staff_member

        index_query = StaffMemberProfileOwedHourIndexQuery.new(
          staff_member: staff_member,
          start_date: owed_hours_start_date_from_params,
          end_date: owed_hours_end_date_from_params,
          payslip_start_date: owed_hours_payslip_start_date_from_params,
          payslip_end_date: owed_hours_payslip_end_date_from_params,
        )

        owed_hours = index_query.all.includes(creator: [:name])

        staff_member_profile_permissions = StaffMemberProfilePermissions.new(
          staff_member: staff_member,
          current_user: current_user,
          owed_hours: owed_hours,
        )

        render json: {
          owedHours: ActiveModel::Serializer::CollectionSerializer.new(
            owed_hours,
            serializer: Api::V1::StaffMemberProfile::OwedHourSerializer,
          ),
          startDate: owed_hours_start_date_from_params && UIRotaDate.format(owed_hours_start_date_from_params),
          endDate: owed_hours_end_date_from_params && UIRotaDate.format(owed_hours_end_date_from_params),
          payslipStartDate: owed_hours_payslip_start_date_from_params && UIRotaDate.format(owed_hours_payslip_start_date_from_params),
          payslipEndDate: owed_hours_payslip_end_date_from_params && UIRotaDate.format(owed_hours_payslip_end_date_from_params),
          permissionsData: Api::V1::StaffMemberProfile::PermissionsSerializer.new(staff_member_profile_permissions),
          isAdminPlus: current_user.has_effective_access_level?(AccessLevel.admin_access_level),
        }
      end

      def update
        staff_member = StaffMember.find(params.fetch(:staff_member_id))
        owed_hour = staff_member.owed_hours.find(params.fetch(:id))

        result = OwedHourApiService.new(
          requester: current_user,
          owed_hour: owed_hour,
        ).update(owed_hour_update_params)

        if result.success?
          render(
            json: {
              owedHour: Api::V1::StaffMemberProfile::OwedHourSerializer.new(result.owed_hour),
              permissions: {
                isEditable: current_ability.can?(:edit, result.owed_hour),
                isDeletable: current_ability.can?(:destroy, result.owed_hour),
              },
            },
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def create
        staff_member = StaffMember.find(params.fetch(:staff_member_id))

        result = OwedHourApiService.new(
          requester: current_user,
          owed_hour: OwedHour.new(staff_member: staff_member),
        ).create(owed_hour_create_params)

        if result.success?
          render(
            json: {
              owedHour: Api::V1::StaffMemberProfile::OwedHourSerializer.new(result.owed_hour),
              permissions: {
                isEditable: current_ability.can?(:edit, result.owed_hour),
                isDeletable: current_ability.can?(:destroy, result.owed_hour),
              },
            },
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      def destroy
        staff_member = StaffMember.find(params[:staff_member_id])
        owed_hour = staff_member.owed_hours.enabled.where(id: params[:id]).first
        raise ActiveRecord::RecordNotFound unless owed_hour.present?

        result = OwedHourApiService.new(
          requester: current_user,
          owed_hour: owed_hour,
        ).destroy

        if result.success?
          render(
            json: {},
            status: 200,
          )
        else
          render "api/v1/shared/api_errors.json", status: 422, locals: {api_errors: result.api_errors}
        end
      end

      private

      def owed_hour_create_params
        {
          date: UIRotaDate.parse_if_present(params.fetch(:date)),
          starts_at: params.fetch(:startsAt) && Integer(params.fetch(:startsAt)),
          ends_at: params.fetch(:endsAt) && Integer(params.fetch(:endsAt)),
          note: params[:note],
        }
      end

      def owed_hour_update_params
        owed_hour_create_params.
          merge(payslip_date: UIRotaDate.parse_if_present(params.fetch(:payslipDate)))
      end

      def owed_hours_start_date_from_params
        UIRotaDate.parse_if_present(params["start_date"])
      end

      def owed_hours_end_date_from_params
        UIRotaDate.parse_if_present(params["end_date"])
      end

      def owed_hours_payslip_start_date_from_params
        UIRotaDate.parse_if_present(params["payslip_start_date"])
      end

      def owed_hours_payslip_end_date_from_params
        UIRotaDate.parse_if_present(params["payslip_end_date"])
      end
    end
  end
end
