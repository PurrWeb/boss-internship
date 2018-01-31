module Api
  module V1
    class AccessoryRequestsController < APIController
      before_filter :web_token_authenticate!
      before_filter :set_paper_trail_whodunnit

      def index
        per_page = 2
        accessories = venue_from_params
          .accessories
          .where(id: AccessoryRequest.joins(:accessory).where(accessories: {venue_id: venue_from_params}).pluck(:accessory_id))
        accessory_requests = AccessoryRequest.where(accessory_id: accessories.pluck(:id))
        accessory_refund_requests = AccessoryRefundRequest.where(accessory_request_id: accessory_requests.pluck(:id))
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
              accessory_requests,
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
        request_from_params.transition_to!(:accepted, requster_user_id: current_user.id)
        render json: request_from_params, serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer, status: 200
      end

      def reject
        request_from_params.transition_to!(:rejected, requster_user_id: current_user.id)
        render json: request_from_params, serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer, status: 200
      end

      def accept_refund
        refund_request_from_params.transition_to!(:accepted, requster_user_id: current_user.id)
        render json: refund_request_from_params, serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer, status: 200
      end

      def reject_refund
        refund_request_from_params.transition_to!(:rejected, requster_user_id: current_user.id)
        render json: refund_request_from_params, serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer, status: 200
      end

      private
      def page_from_params
        params[:page].to_i || 1
      end

      def request_from_params
        AccessoryRequest.find_by(
          accessory: venue_from_params.accessories.find_by(id: params.fetch(:accessoryId)),
          id: params.fetch(:id)
        )
      end

      def refund_request_from_params
        accessory = venue_from_params.accessories.find_by(id: params.fetch(:accessoryId))
        AccessoryRefundRequest.find_by(id: params.fetch(:id)) if accessory.present?
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
