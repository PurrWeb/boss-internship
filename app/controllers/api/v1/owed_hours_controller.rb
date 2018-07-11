module Api
  module V1
    class OwedHoursController < APIController
      before_filter :web_token_authenticate!

      def update
        staff_member = StaffMember.find(params.fetch(:staff_member_id))
        owed_hour = staff_member.owed_hours.find(params.fetch(:id))

        result = OwedHourApiService.new(
          requester: current_user,
          owed_hour: owed_hour,
        ).update(owed_hour_update_params)

        if result.success?
          owed_hours = OwedHour.enabled
            .where(staff_member: staff_member)
            .includes(creator: [:name]).all

          serialized_owed_hours = OwedHourWeekView.new(owed_hours: owed_hours).serialize

          render(
            json: serialized_owed_hours,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
        
      end

      def create
        staff_member = StaffMember.find(params.fetch(:staff_member_id))

        result = OwedHourApiService.new(
          requester: current_user,
          owed_hour: OwedHour.new(staff_member: staff_member),
        ).create(owed_hour_create_params)

        if result.success?
          owed_hours = OwedHour.enabled
            .where(staff_member: staff_member)
            .includes(creator: [:name]).all

          serialized_owed_hours = OwedHourWeekView.new(owed_hours: owed_hours).serialize

          render(
            json: serialized_owed_hours,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
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
          owed_hours = OwedHour.enabled
            .where(staff_member: staff_member)
            .includes(creator: [:name]).all

          serialized_owed_hours = OwedHourWeekView.new(owed_hours: owed_hours).serialize

          render(
            json: serialized_owed_hours,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      private
      def owed_hour_create_params
        {
          date: UIRotaDate.parse_if_present(params.fetch(:date)),
          starts_at: params.fetch(:startsAt) && Integer(params.fetch(:startsAt)),
          ends_at: params.fetch(:endsAt) && Integer(params.fetch(:endsAt)),
          note: params[:note]
        }
      end

      def owed_hour_update_params
        owed_hour_create_params.
          merge(payslip_date: UIRotaDate.parse_if_present(params.fetch(:payslipDate)))
      end
    end
  end
end
