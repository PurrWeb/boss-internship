class ProcessDailyReportsJob < RecurringJob
  def perform
    reports = DailyReport.requiring_update.last(2)
    reports.each do |report|
      UpdateDailyReport.new(report: report).call
    end
  end
end
