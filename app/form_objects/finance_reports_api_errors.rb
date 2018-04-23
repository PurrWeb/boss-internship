class FinanceReportsApiErrors
  def initialize(finance_reports:)
    @finance_reports = finance_reports
  end
  attr_reader :finance_reports

  def errors
    result = {}
    result[:base] = finance_reports.errors[:base] if finance_reports.errors[:base].present?

    result
  end
end
