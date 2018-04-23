class FinanceReportApiErrors
  def initialize(finance_report:)
    @finance_report = finance_report
  end
  attr_reader :finance_report

  def errors
    result = {}
    result[:base] = finance_report.errors[:base] if finance_report.errors[:base].present?

    result
  end
end
