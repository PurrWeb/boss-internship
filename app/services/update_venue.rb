class UpdateVenue
  class Result < Struct.new(:success, :venue)
    def success?
      success
    end
  end

  def initialize(venue:, params:)
    @venue = venue
    @params = params
  end
  attr_reader :venue, :params

  def call
    success = false
    old_name = venue.name
    ActiveRecord::Base.transaction do
      success = venue.update_attributes(params)
      if success && old_name != venue.name
        venue.finance_reports.not_in_state([FinanceReportStateMachine::REQUIRING_UPDATE_STATE, FinanceReportStateMachine::DONE_STATE]).find_each do |finance_report|
          finance_report.mark_requiring_update!
        end
      end
      raise ActiveRecord::Rollback unless success
    end
    Result.new(success, venue)
  end
end
