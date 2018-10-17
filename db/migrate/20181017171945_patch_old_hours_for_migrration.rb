class PatchOldHoursForMigrration < ActiveRecord::Migration
  def change
    system_user = User.first

    periods_without_accepted_by = HoursAcceptancePeriod.
      accepted.
      where(
        accepted_by: nil,
        accepted_at: nil,
      )

    ActiveRecord::Base.transaction do
      periods_without_accepted_by.find_each do |hours_acceptance_period|
        finance_report = nil
        if hours_acceptance_period.finance_report.present?
          finance_report = hours_acceptance_period.finance_report
        else
          staff_member = hours_acceptance_period.staff_member
          week = RotaWeek.new(hours_acceptance_period.date)

          finance_report = MarkFinanceReportRequiringUpdate.new(
            staff_member: staff_member,
            week: week,
          ).call
        end

        hours_acceptance_period.reload
        last_break = hours_acceptance_period.hours_acceptance_breaks.last
        if last_break.ends_at > hours_acceptance_period.ends_at
          last_break.update_attributes!(
            ends_at: hours_acceptance_period.ends_at
          )
        end

        hours_acceptance_period.update_attributes!(
          finance_report: finance_report,
          accepted_by: system_user,
          accepted_at: hours_acceptance_period.ends_at
        )
      end
    end
  end
end
