class UpdateCurrentTaxYearFinanceReports < ActiveRecord::Migration
  def change
    current_tax_year = TaxYear.new(Time.current)
    puts "Updateing all Finance reports in current tax year"
    puts "**************************************"
    puts "failing ids:"
    FinanceReport.in_state(:requiring_update).where("`week_start` >= ?", current_tax_year.start_date).each do |finance_report|
      begin

        UpdateFinanceReportData.new(requester: User.first, finance_report: finance_report).call
      rescue Statesman::GuardFailedError
        puts finance_report.id
      end
    end
  end
end
