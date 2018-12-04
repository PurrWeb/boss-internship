module Api
  module V1
    class AccessoryRequestsController < APIController
      before_filter :web_token_authenticate!
      before_filter :set_paper_trail_whodunnit

      def index
        authorize!(:view, :accessory_requests_page)

        per_page = 10
        all_venue_accessories = venue_from_params
          .accessories
        venue_accessories_requests = AccessoryRequest.where(accessory_id: all_venue_accessories.pluck(:id))
        refund_request_accessory_ids = venue_accessories_requests.inject([]) do |acc, request|
          states = ["pending", "accepted"]
          request.accessory_refund_request.andand.current_state.in?(states) ? acc << request.accessory_id : acc
        end
        accessories = all_venue_accessories
          .where(id: (venue_accessories_requests.in_state(:pending, :accepted).pluck(:accessory_id) + refund_request_accessory_ids))
        all_accessory_requests = AccessoryRequest.where(accessory_id: accessories.pluck(:id))
        accessory_requests = all_accessory_requests.in_state([:pending, :accepted])

        accessory_refund_requests = AccessoryRefundRequest.in_state(:pending, :accepted).
        where(accessory_request_id: all_accessory_requests.pluck(:id)).
        includes(:accessory_request)

        staff_members = StaffMember.where(id: accessory_requests.pluck(:staff_member_id).concat(accessory_refund_requests.pluck(:staff_member_id)))


        paginated_accessory = accessories.paginate(
          page: page_from_params,
          per_page: per_page,
        )
        accessory_requests_permissions = AccessoryRequestsPagePermissions.new(
          requester: current_user,
          accessory_requests: accessory_requests,
          accessory_refund_requests: accessory_refund_requests
        )

        render(
          json: {
            accessories: ActiveModel::Serializer::CollectionSerializer.new(
              paginated_accessory,
              serializer: Api::V1::AccessoryRequests::AccessorySerializer,
            ),
            accessoryRequests: ActiveModel::Serializer::CollectionSerializer.new(
              accessory_requests,
              serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer,
            ),
            accessoryRefundRequests: ActiveModel::Serializer::CollectionSerializer.new(
              accessory_refund_requests,
              serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer,
            ),
            staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
              staff_members,
              serializer: Api::V1::SimpleStaffMemberSerializer,
            ),
            permissionsData: Api::V1::AccessoryRequests::PermissionsSerializer.new(accessory_requests_permissions),
            pagination: {
              pageNumber: page_from_params,
              perPage: per_page,
              totalCount: accessories.count,
              totalPages: (accessories.count / per_page) + 1,
            },
          },
          status: 200,
        )
      end

      def accept
        authorize!(:accept, :accessories_requests)

        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params,
        ).accept

        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def reject
        authorize!(:reject, :accessories_requests)

        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params,
        ).reject

        if result.success?
          render(
            json: {
              accessoryRequest: Api::V1::AccessoryRequests::AccessoryRequestSerializer.new(result.accessory_request),
              accessory: Api::V1::AccessoryRequests::AccessorySerializer.new(result.accessory_request.accessory),
            },
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def undo
        authorize!(:undo, :accessories_requests)

        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params,
        ).undo

        if result.success?
          render(
            json: result.accessory_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRequestSerializer,
            key_transform: :camel_lower,
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def complete
        authorize!(:complete, :accessories_requests)

        result = AccessoryRequestAdminApiService.new(
          requster_user: current_user,
          accessory_request: request_from_params,
        ).complete

        if result.success?
          render(
            json: {
              accessoryRequest: Api::V1::AccessoryRequests::AccessoryRequestSerializer.new(result.accessory_request),
              accessory: Api::V1::AccessoryRequests::AccessorySerializer.new(result.accessory_request.accessory),
            },
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def accept_refund
        authorize!(:accept, refund_request_from_params)

        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params,
        ).accept

        if result.success?
          render(
            json: result.accessory_refund_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer,
            key_transform: :camel_lower,
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def reject_refund
        authorize!(:reject, refund_request_from_params)

        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params,
        ).reject
        if result.success?
          render(
            json: {
              accessoryRefundRequest: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer.new(result.accessory_refund_request),
              accessory: Api::V1::AccessoryRequests::AccessorySerializer.new(result.accessory_refund_request.accessory_request.accessory),
            },
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def undo_refund
        authorize!(:undo, refund_request_from_params)

        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params,
        ).undo

        if result.success?
          render(
            json: result.accessory_refund_request,
            serializer: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer,
            key_transform: :camel_lower,
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def complete_refund
        authorize!(:complete, refund_request_from_params)

        result = AccessoryRefundRequestAdminApiService.new(
          requster_user: current_user,
          accessory_refund_request: refund_request_from_params,
        ).complete(reusable: params.fetch(:reusable))

        if result.success?
          render(
            json: {
              accessoryRefundRequest: Api::V1::AccessoryRequests::AccessoryRefundRequestSerializer.new(result.accessory_refund_request),
              accessory: Api::V1::AccessoryRequests::AccessorySerializer.new(result.accessory_refund_request.accessory_request.accessory),
            },
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update_payslip_date
        accessory_request = AccessoryRequest.find(params.fetch(:id))
        authorize!(:update_payslip_date, :accessory_requests)

        new_payslip_date = UIRotaDate.parse(params.fetch("payslipDate"))

        result = UpdateAccessoryRequestPayslipDate.new(
          accessory_request: accessory_request,
          new_payslip_date: new_payslip_date,
          requester: current_user,
        ).call

        if result.success?
          render(
            json: {
              accessoryRequest: Api::V1::StaffMemberProfile::AccessoryRequestSerializer.new(accessory_request),
            },
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update_refund_payslip_date
        accessory_request = AccessoryRequest.where(params.fetch(:id)).
          includes([:accessory_refund_request]).first
        accessory_refund_request = accessory_request.accessory_refund_request

        authorize!(:update_refund_payslip_date, :accessory_requests)

        new_payslip_date = UIRotaDate.parse(params.fetch("payslipDate"))

        result = UpdateAccessoryRefundRequestPayslipDate.new(
          accessory_refund_request: accessory_refund_request,
          new_payslip_date: new_payslip_date,
          requester: current_user,
        ).call

        if result.success?
          render(
            json: {
              accessoryRequest: Api::V1::StaffMemberProfile::AccessoryRequestSerializer.new(accessory_request.reload),
            },
            status: 200,
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
        result = AccessoryRequest.find_by(
          accessory: accessory_from_params,
          id: params.fetch(:id),
        )
        ActiveRecord::Associations::Preloader.new.preload(result, {staff_member: [:master_venue]}) if result
        result
      end

      def refund_request_from_params
        result = AccessoryRefundRequest.find_by(id: params.fetch(:id)) if accessory_from_params.present?
        ActiveRecord::Associations::Preloader.new.preload(result, {staff_member: [:master_venue], accessory_request: [:accessory]}) if result
        result
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
