module Api
  module V1
    class HolidaysController < APIController
      before_filter :web_token_authenticate!

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
        ).update({
          start_date: params[:start_date],
          end_date: params[:end_date],
          holiday_type: params[:holiday_type],
          note: params[:note]
        })

        if result.success?
          render(
            json: result.holiday,
            serializer: HolidaySerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
        
      end
      
      def destroy
        staff_member = StaffMember.find(params[:staff_member_id])
        holiday = staff_member.holidays.in_state(:enabled).where(id: params[:id]).first
        
        result = HolidayApiService.new(
          requester: current_user,
          holiday: holiday,
        ).destroy

        if result.success?
          render(
            json: result.holiday,
            serializer: HolidaySerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def create
        staff_member = StaffMember.find(params.fetch(:staff_member_id))

        result = HolidayApiService.new(
          requester: current_user,
          holiday: Holiday.new(staff_member: staff_member),
        ).create({
          start_date: params[:start_date],
          end_date: params[:end_date],
          holiday_type: params[:holiday_type],
          note: params[:note]
        })

        if result.success?
          render(
            json: result.holiday,
            serializer: HolidaySerializer,
            status: 200
          )
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end
    end
  end
end
