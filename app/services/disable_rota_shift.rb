class DisableRotaShift
  def initialize(requester:, shift:)
    @requester = requester
    @shift = shift
  end

  def call
    raise RuntimeError.new('shift already disabled') if shift.disabled?

    ActiveRecord::Base.transaction do
      shift.update_attributes!(
        enabled: false,
        disabled_by_user: requester,
        disabled_at: Time.now
      )

      shift.staff_member.mark_requiring_notification! if shift.rota_published?
      UpdateRotaForecast.new(rota: shift.rota).call if shift.part_of_forecast?
    end
  end

  private
  attr_reader :requester, :shift
end
