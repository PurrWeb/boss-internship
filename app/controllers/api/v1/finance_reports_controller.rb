module Api
  module V1
    class FinanceReportsController < APIController
      before_action :web_token_authenticate!

      def complete_multiply
        authorize!(:complete, :finance_reports)

        week = week_from_params
        staff_members = staff_members_from_params

        MarkFinanceReportsComplete.new(
          staff_members: staff_members,
          week: week
        ).call

        render(
          json: {},
          status: 200
        )
      end

      def complete
        authorize!(:complete, :finance_reports)

        week = week_from_params
        staff_member = staff_member_from_params

        MarkFinanceReportComplete.new(
          staff_member: staff_member,
          week: week
        ).call

        render(
          json: {},
          status: 200
        )
      end

      private

      def week_from_params
        RotaWeek.new(UIRotaDate.parse(params.fetch(:id))) if params[:id].present?
      end

      def venue_from_params
        Venue.find_by(id: params[:venue_id])
      end

      def staff_member_from_params
        StaffMember.find(params.fetch(:staffMemberId))
      end

      def staff_members_from_params
        params.fetch("staffMemberIds").map do |id_param|
          id = Integer(id_param)
          StaffMember.find(id)
        end
      end
    end
  end
end
