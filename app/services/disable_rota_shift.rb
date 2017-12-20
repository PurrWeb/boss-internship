class DisableRotaShift
  def initialize(requester:, shift:, notify_staff_member: true, frontend_updates:)
    @requester = requester
    @shift = shift
    @notify_staff_member = notify_staff_member
    @frontend_updates = frontend_updates
  end

  def call
    raise RuntimeError.new('shift already disabled') if shift.disabled?

    ActiveRecord::Base.transaction do
      shift.update_attributes!(
        enabled: false,
        disabled_by_user: requester,
        disabled_at: Time.zone.now
      )
      frontend_updates.delete_shift(shift: shift)

      if notify_staff_member && shift.rota_published?
        shift.staff_member.mark_requiring_notification!
      end
      UpdateRotaForecast.new(rota: shift.rota).call if shift.part_of_forecast?

      DailyReport.mark_for_update!(
        date: shift.rota.date,
        venue: shift.rota.venue
      )
    end
  end

  private
  attr_reader :requester, :shift, :notify_staff_member, :frontend_updates
end
