module Api
  module V1
    class AccessoryRequestsController < APIController
      before_filter :web_token_authenticate!
      before_filter :set_paper_trail_whodunnit

      def index
        per_page = 2
        all_venue_accessories = venue_from_params
          .accessories
        venue_accessories_requests = AccessoryRequest.where(accessory_id: all_venue_accessories.pluck(:id))
        refund_request_accessory_ids = venue_accessories_requests.inject([]) do |acc, request|
          states = ["pending", "accepted"]
          request.accessory_refund_request.andand.current_state.in?(states) \
            ? acc << request.accessory_id \
            : acc
        end
        accessories = all_venue_accessories
          .where(id: (venue_accessories_requests.in_state(:pending, :accepted).pluck(:accessory_id) + refund_request_accessory_ids))
        accessory_requests = AccessoryRequest.where(accessory_id: accessories.pluck(:id))
        accessory_refund_requests = AccessoryRefundRequest.in_state(:pending, :accepted).where(accessory_request_id: accessory_requests.pluck(:id))
        staff_members = StaffMember.where(id: accessory_requests.pluck(:staff_member_id))

        paginated_accessory = accessories.paginate(
          page: page_from_params,
          per_page: per_page
        )

        render(
          json: {
            accessories: ActiveModel::Serializer::CollectionSerializer.new(
              paginated_accessory,
              serializer: Api::V1::AccessoryRequests::AccessorySerializer
            ),
            accessoryRequests: ActiveModel::Serializer::CollectionSerializer.new(
              accessory_requests.in_state(:pending, :accepted),
              serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer
            ),
            accessoryRefundRequests: ActiveModel::Serializer::CollectionSerializer.new(
              accessory_refund_requests,
              serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer
            ),
            staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
              staff_members,
              serializer: Api::V1::SimpleStaffMemberSerializer
            ),
            pagination: {
              pageNumber: page_from_params,
              perPage: per_page,
              totalCount: accessories.count,
              totalPages: (accessories.count / per_page) + 1,
            }
          },
          status: 200
        )
      end

      def accept
        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params
        ).accept

        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def reject
        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params
        ).reject

        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def undo
        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params
        ).undo

        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def complete
        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params
        ).complete

        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def accept_refund
        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params
        ).accept

        if result.success?
          render(
            json: result.accessory_refund_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def reject_refund
        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params
        ).reject

        if result.success?
          render(
            json: result.accessory_refund_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def undo_refund
        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params
        ).undo

        if result.success?
          render(
            json: result.accessory_refund_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def complete_refund
        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params
        ).complete

        if result.success?
          render(
            json: result.accessory_refund_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      private
      def page_from_params
        params[:page].to_i || 1
      end

      def accessory_from_params
        venue_from_params.accessories.find_by(id: params.fetch(:accessoryId))
      end

      def request_from_params
        AccessoryRequest.find_by(
          accessory: accessory_from_params,
          id: params.fetch(:id)
        )
      end

      def refund_request_from_params
        AccessoryRefundRequest.find_by(id: params.fetch(:id)) if accessory_from_params.present?
      end

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params[:venueId])
      end
    end
  end
end
