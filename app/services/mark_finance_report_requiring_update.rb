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
     finance_report.mark_requiring_update!
    else
      FinanceReport.create!(
        staff_member: staff_member,
        venue: venue,
        week_start: week_start,
        requiring_update: true
      )
    end
  end
end
