class MarkFinanceReportRequiringUpdate
  def initialize(staff_member:, week:)
    @staff_member = staff_member
    @week = week
  end
  attr_reader :staff_member, :week

  def call
    FindOrCreateFinanceReport.new(staff_member: staff_member, week: week, mark_existing_requiring_update: true).call
  end
end
