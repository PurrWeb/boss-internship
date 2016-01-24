class DisableRotaShift
  def initialize(requester:, shift:)
    @requester = requester
    @shift = shift
  end

  def call
    raise RuntimeError.new('shift already disabled') if shift.disabled?

    shift.update_attributes!(
      enabled: false,
      disabled_by_user: requester,
      disabled_at: Time.now
    )
  end

  private
  attr_reader :requester, :shift
end
