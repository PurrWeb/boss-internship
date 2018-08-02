class ProcessFinanceReportUpdatesJob < ActiveJob::Base
  def perform
    FinanceReport.requiring_update.limit(5).each do |finance_report|
      UpdateFinanceReportData.new(requester: User.first, finance_report: finance_report).call
    end
  end
end
