module Api
  module V1
    class FinanceReportsController < APIController
      before_action :web_token_authenticate!

      def complete_multiply
        authorize!(:complete, :finance_reports)

        staff_members = staff_members_from_params
        week = week_from_params
        venue = venue_from_params

        finance_reports = FinanceReport.
          where(
            staff_member: staff_members,
            week_start: week.start_date,
            venue: venue
          )

        finance_reports = finance_reports.
          includes(
            :hours_acceptance_periods,
            :holidays,
            :owed_hours,
            :accessories_requests,
            :accessories_refunds
          )

        MarkFinanceReportsComplete.new(finance_reports: finance_reports).call

        render(
          json: {},
          status: 200
        )
      end

      def complete
        authorize!(:complete, :finance_reports)

        week = week_from_params
        staff_member = staff_member_from_params
        venue = venue_from_params

        finance_reports = FinanceReport.
          where(
            staff_member: staff_member,
            venue: venue,
            week_start: week.start_date
          ).includes(
            :hours_acceptance_periods,
            :holidays,
            :owed_hours,
            :accessories_requests,
            :accessories_refunds
          )

        raise 'mutiple finance reports returned for single complete' if finance_reports.count != 1

        MarkFinanceReportComplete.new(finance_reports: finance_reports).call

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
        ids = params.fetch("staffMemberIds").map {|id_param| Integer(id_param) }
        StaffMember.where(id: ids)
      end
    end
  end
end
