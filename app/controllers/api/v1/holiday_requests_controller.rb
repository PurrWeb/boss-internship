module Api
  module V1
    class HolidayRequestsController < APIController
      before_action :web_token_authenticate!

      def create
        user_ability = UserAbility.new(current_user)

        result = HolidayRequestApiService.new(
          requester: current_user,
          holiday_request: HolidayRequest.new(staff_member: staff_member_from_params),
        ).create(params: holiday_request_from_params)

        if result.success?
          render(
            json: {
              holiday_request: Api::V1::StaffMemberProfile::HolidayRequestSerializer.new(
                result.holiday_request,
                scope: current_user
              ),
              permissions: {
                isEditable: user_ability.can?(:edit, result.holiday_request),
                isDeletable: user_ability.can?(:destroy, result.holiday_request)
              }
            },
            status: 200
          )
        else
          render json: { errors: result.api_errors.errors}, status: 422
        end
      end

      def destroy
        staff_member = StaffMember.find(params[:staff_member_id])
        holiday_request = staff_member.holiday_requests.in_state(:pending).where(id: params[:id]).first
        raise ActiveRecord::RecordNotFound unless holiday_request.present?

        result = HolidayRequestApiService.new(
          requester: current_user,
          holiday_request: holiday_request,
        ).destroy

        if result.success?
          render(
            json: result.holiday_request,
            serializer: Api::V1::StaffMemberProfile::HolidayRequestSerializer,
            scope: current_user,
            status: 200
          )
        else
          render json: { errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        staff_member = StaffMember.find(params.fetch(:staff_member_id))
        holiday_request = staff_member.holiday_requests.in_state(:pending).where(id: params[:id]).first
        raise ActiveRecord::RecordNotFound unless holiday_request.present?

        result = HolidayRequestApiService.new(
          requester: current_user,
          holiday_request: holiday_request,
        ).update(holiday_request_from_params)

        if result.success?
          render(
            json: {
              holiday_request: Api::V1::StaffMemberProfile::HolidayRequestSerializer.new(
                result.holiday_request,
                scope: current_user
              ),
              permissions: {
                isEditable: can?(:edit, result.holiday_request),
                isDeletable: can?(:destroy, result.holiday_request)
              }
            },
            status: 200
          )
        else
          render json: { errors: result.api_errors.errors}, status: 422
        end
      end

      def accept
        staff_member = StaffMember.find(params[:staffMemberId])
        holiday_request = staff_member.holiday_requests.in_state(:pending).where(id: params[:id]).first
        raise ActiveRecord::RecordNotFound unless holiday_request.present?

        result = HolidayRequestApiService.new(
          requester: current_user,
          holiday_request: holiday_request,
        ).accept

        if result.success?
          render(
            json: result.holiday_request,
            serializer: Api::V1::StaffMemberProfile::HolidayRequestSerializer,
            status: 200
          )
        else
          render json: { errors: result.api_errors.errors}, status: 422
        end
      end

      def reject
        staff_member = StaffMember.find(params[:staffMemberId])
        holiday_request = staff_member.holiday_requests.in_state(:pending).where(id: params[:id]).first
        raise ActiveRecord::RecordNotFound unless holiday_request.present?

        result = HolidayRequestApiService.new(
          requester: current_user,
          holiday_request: holiday_request,
        ).reject

        if result.success?
          render(
            json: result.holiday_request,
            serializer: Api::V1::StaffMemberProfile::HolidayRequestSerializer,
            status: 200
          )
        else
          render json: { errors: result.api_errors.errors}, status: 422
        end
      end

      private
      def staff_member_from_params
        StaffMember.find_by(id: params.fetch(:staff_member_id))
      end

      def holiday_request_from_params
        {
          start_date: params.fetch(:start_date),
          end_date: params.fetch(:end_date),
          holiday_type: params.fetch(:holiday_type),
          note: params[:note]
        }
      end
    end
  end
end
