class CreateHoursAcceptancePeriod
  class Result < Struct.new(:success, :hours_acceptance_period, :breaks)
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, venue:, date:, starts_at:, ends_at:, status:, hours_acceptance_reason:, reason_note:, breaks:)
    @requester = requester
    @staff_member = staff_member
    @venue = venue
    @date = date
    @starts_at = starts_at
    @ends_at = ends_at
    @status = status
    @hours_acceptance_reason = hours_acceptance_reason
    @reason_note = reason_note
    @breaks = breaks
  end

  def call
    hours_acceptance_period = nil
    success = false

    ActiveRecord::Base.transaction do
      clock_in_day = ClockInDay.find_or_initialize_by(
        venue: venue,
        date: date,
        staff_member: staff_member
      )

      if clock_in_day.new_record?
        clock_in_day.update_attributes!(creator: requester)
      end

      hours_acceptance_period = HoursAcceptancePeriod.new(
        clock_in_day: clock_in_day,
        creator: requester,
        starts_at: starts_at,
        ends_at: ends_at,
        status: status,
        hours_acceptance_reason: hours_acceptance_reason,
        reason_note: reason_note
      )

      breaks.each do |_break|
        success = _break.update_attributes(
          hours_acceptance_period: hours_acceptance_period
        )
        hours_acceptance_period.hours_acceptance_breaks << _break
      end

      success = hours_acceptance_period.save
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, hours_acceptance_period, breaks)
  end

  private
  attr_reader :requester, :staff_member, :venue, :date, :starts_at, :ends_at, :status, :status, :hours_acceptance_reason, :reason_note, :breaks
end
