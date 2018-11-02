class ClockInRolloverJob < ActiveJob::Base
  def perform(env: Rails.env, service: ReClockInStaffMemberToNextDay)
    service.new.call
  end
end

