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
          venue: venue,
        )

        finance_reports = finance_reports.
          includes(
          :hours_acceptance_periods,
          :holidays,
          :owed_hours,
          :accessory_requests,
          :accessory_refund_requests
        )

        MarkFinanceReportsComplete.new(finance_reports: finance_reports).call

        render(
          json: {financeReports: ActiveModel::Serializer::CollectionSerializer.new(
            finance_reports,
            serializer: Api::V1::FinanceReports::FinanceReportSerializer,
            scope: {ability: current_ability},
          )},
          status: 200,
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
          week_start: week.start_date,
        ).includes(
          :hours_acceptance_periods,
          :holidays,
          :owed_hours,
          :accessory_requests,
          :accessory_refund_requests
        )

        raise "mutiple finance reports returned for single complete" if finance_reports.count != 1

        MarkFinanceReportsComplete.new(finance_reports: finance_reports).call

        render(
          json: {
            financeReports: ActiveModel::Serializer::CollectionSerializer.new(
              finance_reports,
              serializer: Api::V1::FinanceReports::FinanceReportSerializer,
              scope: {ability: current_ability},
            ),
          },
          status: 200,
        )
      end

      private

      def week_from_params
        RotaWeek.new(UIRotaDate.parse(params.fetch(:id))) if params[:id].present?
      end

      def venue_from_params
        Venue.find(params.fetch("venueId"))
      end

      def staff_member_from_params
        StaffMember.find(params.fetch(:staffMemberId))
      end

      def staff_members_from_params
        ids = params.fetch("staffMemberIds").map { |id_param| Integer(id_param) }
        StaffMember.where(id: ids)
      end
    end
  end
end
