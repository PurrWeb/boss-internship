class MoveStaffMembersToCorrectPayRateJob < ActiveJob::Base
  def perform
    UpdateStaffMembersOnAgedPayRates.new.call
  end
end
