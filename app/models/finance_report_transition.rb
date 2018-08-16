class FinanceReportTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition


  belongs_to :finance_report, inverse_of: :finance_report_transitions
end
