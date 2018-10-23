class MigrateIncompleteFinanceReportsToVenue
  def initialize(new_master_venue:, staff_member:, nested: false)
    @new_master_venue = new_master_venue
    @staff_member = staff_member
    @nested = nested
  end
  attr_reader :new_master_venue, :staff_member, :nested

  def call
    incomplete_finance_reports = staff_member.finance_reports.not_in_state([FinanceReportStateMachine::DONE_STATE, FinanceReportStateMachine::REQUIRING_UPDATE_STATE]).includes([:hours_acceptance_periods, :owed_hours, :holidays])

    return nil if incomplete_finance_reports.count == 0

    ActiveRecord::Base.transaction(requires_new: nested) do
      incomplete_finance_reports.find_each do |incomplete_finance_report|
        replacement_report = FinanceReport.create!(
          staff_member: staff_member,
          staff_member_name: staff_member.full_name,
          venue: new_master_venue,
          venue_name: new_master_venue.name,
          pay_rate_description: staff_member.pay_rate.text_description_short,
          week_start: incomplete_finance_report.week_start,
          requiring_update: true
        )

        incomplete_finance_report.
          hours_acceptance_periods.
          find_each do |hours_acceptance_period|
          # ignore invalid records
          hours_acceptance_period.update_attribute(
            :finance_report_id,
            replacement_report.id
          )
        end

        incomplete_finance_report.
          holidays.
          find_each do |holiday|
          # ignore invalid records
          holiday.update_attribute(
            :finance_report_id,
            replacement_report.id
          )
        end

        incomplete_finance_report.
          owed_hours.
          find_each do |owed_hour|
          # ignore invalid records
          owed_hour.update_attribute(
            :finance_report_id,
            replacement_report.id
          )
        end

        incomplete_finance_report.
          accessory_requests.
          find_each do |accessory_request|
            # ignore invalid records
            accessory_request.update_attribute(
              :finance_report_id,
              replacement_report.id
            )
          end

        incomplete_finance_report.
          accessory_refund_requests.
          find_each do |accessory_refund_request|
            # ignore invalid records
            accessory_refund_request.update_attribute(
              :finance_report_id,
              replacement_report.id
            )
          end

        if !replacement_report.reload.requiring_update?
          replacement_report.mark_requiring_update!
        end

        incomplete_finance_report.destroy
      end
    end
  end
end
