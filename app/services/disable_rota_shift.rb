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

      if shift.rota_published?
        shift.staff_member.mark_requiring_notification!
      end
    end
  end

  private
  attr_reader :requester, :shift
end
