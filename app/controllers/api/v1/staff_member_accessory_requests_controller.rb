module Api
  module V1
    class StaffMemberAccessoryRequestsController < APIController
      before_filter :web_token_authenticate!
      before_filter :set_paper_trail_whodunnit

      def create
        staff_member = staff_member_from_params
        result = AccessoryRequestApiService.new(
          requester: current_user,
          staff_member: staff_member_from_params,
          accessory_request: AccessoryRequest.new,
        ).create(params: accessory_request_params)
        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::StaffMemberProfile::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def cancel_request
        staff_member = staff_member_from_params
        result = AccessoryRequestApiService.new(
          requester: current_user,
          staff_member: staff_member_from_params,
          accessory_request: accessory_request_from_params,
        ).cancel
        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::StaffMemberProfile::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def refund_request
        staff_member = staff_member_from_params
        accessory_request = accessory_request_from_params

        result = AccessoryRequestApiService.new(
          requester: current_user,
          staff_member: staff_member_from_params,
          accessory_request: accessory_request,
        ).refund
        if result.success?
          render(
            json: {
            accessoryRequest: Api::V1::StaffMemberProfile::AccessoryRequestSerializer.new(accessory_request),
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      private
      def accessory_request_params
        params.permit(:size, :accessoryId)
      end

      def staff_member_from_params
        StaffMember.includes(:name).find_by(id: params.fetch(:staff_member_id))
      end

      def accessory_request_from_params
        staff_member_from_params.accessory_requests.find_by(id: params.fetch(:id)) if staff_member_from_params.present?
      end
    end
  end
end
