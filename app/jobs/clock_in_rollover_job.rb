class ClockInRolloverJob < ActiveJob::Base
  def perform(env: Rails.env, service: ReClockInStaffMemberToNextDay)
    return unless env == "production"

    service.new.call
  end
end

