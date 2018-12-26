class CreateStaffMember
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(requester:, now: Time.zone.now, params:, nested: false)
    @requester = requester
    @now = now
    @params = params
    @nested = nested
  end

  def call
    result = false
    staff_member = StaffMember.new

    ActiveRecord::Base.transaction(requires_new: nested) do
      staff_member.assign_attributes(params.merge(
        id_scanner_guid: SecureRandom.uuid
      ))

      StaffMemberPostAssignAccessiblePayRateValidation.new(requester: requester).call(staff_member: staff_member)

      # notified_of_sia_expiry_at is set to now if we don't want to send
      # an update
      if staff_member.security? && staff_member.sia_badge_expiry_date.present?
        if staff_member.sia_badge_expiry_date < now
          staff_member.notified_of_sia_expiry_at = now
        end
      end

      result = staff_member.save

      if result
        StaffTrackingEvent.create!(
          at: staff_member.created_at,
          event_type: StaffTrackingEvent::CREATION_EVENT_TYPE,
          staff_member: staff_member
        )
        StaffMemberUpdatesMailer.new_staff_member(staff_member).deliver_now
        if staff_member.pay_rate.weekly?
          update_related_daily_reports(staff_member)
        end
      end
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :now, :nested, :params, :requester

  def update_related_daily_reports(staff_member)
    DailyReportDatesEffectedByStaffMemberOnWeeklyPayRateQuery.new(
      staff_member: staff_member
    ).to_a.each do |date, venue|
      DailyReport.mark_for_update!(date: date, venue: venue)
    end
  end
end
