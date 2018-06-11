require 'csv'

class SageFinanceReportExportCSV
  def initialize(staff_members:, week:)
    @staff_members = staff_members
    @week = week
  end
  attr_reader :staff_members, :week

  def to_s
    CSV.generate do |csv|
      csv << [
        'Sage ID',
        'Date',
        'Weekly Hours'
      ]

      staff_members.each do |staff_member|
        raise "Attempt to export staff member #{staff_member.id} with no sage id" unless staff_member.sage_id.present?

        report = FinanceReport.find_by(
          staff_member: staff_member,
          week_start: week.start_date
        ) || GenerateFinanceReportData.new(
          staff_member: staff_member,
          week: week
        ).call.report

        raise "Attempt to export incomplete finance report for staff member #{staff_member.id}" unless report.status === FinanceReport::REPORT_STATUS_INCOMPLETE_STATUS

        csv << [
          staff_member.sage_id,
          UIRotaDate.format(report.week_start),
          report.total_hours_count
        ]
      end
    end
  end
end
