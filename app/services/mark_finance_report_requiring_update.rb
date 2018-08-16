class MarkFinanceReportRequiringUpdate
  def initialize(staff_member:, week:)
    @staff_member = staff_member
    @week = week
  end
  attr_reader :staff_member, :week

  def call
    week_start = week.start_date
    venue = staff_member.master_venue

    finance_report = FinanceReport.find_by(
      staff_member: staff_member,
      venue: venue,
      week_start: week_start
    )

    if finance_report.present?
     raise "Attempt to mark comepleted finance report #{finance_report.id} requiring update" if finance_report.done?
     finance_report.mark_requiring_update!
    else
      finance_report = FinanceReport.create!(
        staff_member: staff_member,
        staff_member_name: staff_member.full_name,
        pay_rate_description: staff_member.pay_rate.text_description_short,
        venue: venue,
        venue_name: venue.name,
        week_start: week_start,
        requiring_update: true
      )
    end
    finance_report
  end
end
