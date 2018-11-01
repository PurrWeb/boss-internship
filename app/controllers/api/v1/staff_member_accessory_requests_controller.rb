module Api
  module V1
    class StaffMemberAccessoryRequestsController < APIController
      before_filter :web_token_authenticate!
      before_filter :set_paper_trail_whodunnit

      def index
        staff_member = staff_member_from_params
        raise ActiveRecord::RecordNotFound.new unless staff_member.present?
        return nil if staff_member.security?

        payslip_start_date = UIRotaDate.parse(params.fetch("payslip_start_date"))
        payslip_end_date = UIRotaDate.parse(params.fetch("payslip_end_date"))

        accessory_requests = StaffMemberProfileAccessoryRequestQuery.new(
          staff_member: staff_member,
          filter_params: {
            payslip_start_date: payslip_start_date,
            payslip_end_date: payslip_end_date,
          },
        ).all.
          includes([
          :finance_report,
          :created_by_user,
          :accessory,
          accessory_refund_request: [
            :staff_member, :created_by_user, :finance_report,
          ],
        ])

        venue_accessories = staff_member.master_venue.accessories

        render(
          json: {
            accessories: ActiveModel::Serializer::CollectionSerializer.new(
              venue_accessories,
              serializer: Api::V1::StaffMemberProfile::AccessorySerializer,
            ),
            accessoryRequests: ActiveModel::Serializer::CollectionSerializer.new(
              accessory_requests,
              serializer: Api::V1::StaffMemberProfile::AccessoryRequestSerializer,
            ),
            sPayslipStartDate: UIRotaDate.format(payslip_start_date),
            sPayslipEndDate: UIRotaDate.format(payslip_end_date),
          },
          status: 200,
        )
      end

      def create
        staff_member = staff_member_from_params
        authorize!(:create, AccessoryRequest.new(staff_member: staff_member))

        result = AccessoryRequestApiService.new(
          requester: current_user,
          staff_member: staff_member_from_params,
          accessory_request: AccessoryRequest.new,
        ).create(params: accessory_request_params)
        if result.success?
          render(
            json: {
              accessoryRequest: Api::V1::StaffMemberProfile::AccessoryRequestSerializer.new(result.accessory_request),
              permissions: {
                result.accessory_request.id => {
                  isCancelable: current_ability.can?(:cancel, result.accessory_request),
                  isRefundable: current_ability.can?(:refund_request, result.accessory_request)
                }
              }
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def cancel_request
        staff_member = staff_member_from_params
        authorize!(:cancel, accessory_request_from_params)

        result = AccessoryRequestApiService.new(
          requester: current_user,
          staff_member: staff_member_from_params,
          accessory_request: accessory_request_from_params,
        ).cancel
        if result.success?
          render(
            json: {
              accessoryRequest: Api::V1::StaffMemberProfile::AccessoryRequestSerializer.new(result.accessory_request),
            },
            status: 200,
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def refund_request
        staff_member = staff_member_from_params
        accessory_request = accessory_request_from_params
        authorize!(:refund_request, accessory_request)

        result = AccessoryRequestApiService.new(
          requester: current_user,
          staff_member: staff_member_from_params,
          accessory_request: accessory_request,
        ).refund(params.fetch(:reusable))
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
