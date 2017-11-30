class CreateHoursAcceptancePeriod
  class Result < Struct.new(:success, :hours_acceptance_period, :breaks)
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, venue:, date:, starts_at:, ends_at:, status:, reason_note:, breaks:)
    @requester = requester
    @staff_member = staff_member
    @venue = venue
    @date = date
    @starts_at = starts_at
    @ends_at = ends_at
    @status = status
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
        reason_note: reason_note
      )

      if status == HoursAcceptancePeriod::ACCEPTED_STATE
        hours_acceptance_period.assign_attributes({
          accepted_at: Time.now.utc,
          accepted_by: requester,
        })
      end

      breaks.each do |_break|
        success = _break.update_attributes(
          hours_acceptance_period: hours_acceptance_period
        )
        hours_acceptance_period.hours_acceptance_breaks << _break
      end

      success = hours_acceptance_period.save
      if success && hours_acceptance_period.accepted?
        DailyReport.mark_for_update!(
          date: hours_acceptance_period.date,
          venue: hours_acceptance_period.venue
        )
      end

      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, hours_acceptance_period, breaks)
  end

  private
  attr_reader :requester, :staff_member, :venue, :date, :starts_at, :ends_at, :status, :status, :reason_note, :breaks
end
