module Api
  module V1
    class OwedHoursController < APIController
      before_filter :web_token_authenticate!

      def index
        query = StaffMember.where(id: params.fetch(:staff_member_id))
        query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
        staff_member = query.first
        raise ActiveRecord::RecordNotFound.new unless staff_member.present?
        if can? :edit, staff_member
          owed_hours = OwedHour.enabled.
          where(staff_member: staff_member).
          includes(creator: [:name]).all
          
        owed_hours_by_week = owed_hours.group_by { |owed_hour| RotaWeek.new(owed_hour.date)  }.sort_by { |week, hours| week }
    
          access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    
          render(
            json: {
              staff_member: ::StaffMemberSerializer.new(staff_member),
              access_token: access_token.token,
              holidays: ActiveModel::Serializer::CollectionSerializer.new(filtered_holidays, serializer: ::HolidaySerializer),
              paid_holiday_days: paid_holiday_days,
              unpaid_holiday_days: unpaid_holiday_days,
              estimated_accrued_holiday_days: estimated_accrued_holiday_days,
              holiday_start_date: holiday_start_date,
              holiday_end_date: holiday_end_date,
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
        owed_hour = staff_member.owed_hours.find(params.fetch(:id))        

        result = OwedHourApiService.new(
          requester: current_user,
          owed_hour: owed_hour,
        ).update(owed_hour_from_params)

        if result.success?
          render(
            json: OwedHourView.new(owed_hour: result.owed_hour).serialize,
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
        ).create(owed_hour_from_params)

        if result.success?
          render(
            json: OwedHourView.new(owed_hour: result.owed_hour).serialize,
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
          render(
            json: OwedHourView.new(owed_hour: result.owed_hour).serialize,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      private
      def owed_hour_from_params
        {
          date: UIRotaDate.parse(params.fetch(:date)),
          starts_at: Integer(params.fetch(:startsAt)),
          ends_at: Integer(params.fetch(:endsAt)),
          note: params[:note]
        }
      end
    end
  end
end
