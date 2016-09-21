class ProcessDailyReportsJob < RecurringJob
  def perform
    report = DailyReport.requiring_update.first
    if report.present?
      UpdateDailyReport.new(report: report).call
    end
  end
end
