class ProcessFinanceReportUpdatesJob < ActiveJob::Base
  def perform
    FinanceReport.in_state(:requiring_update).order(week_start: :desc).limit(5).each do |finance_report|
      UpdateFinanceReportData.new(requester: User.first, finance_report: finance_report).call
    end
  end
end
