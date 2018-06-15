class MoveStaffMembersToCorrectPayRateJob < ActiveJob::Base
  def perform
    UpdateStaffMembersPayRate.new.call
  end
end
