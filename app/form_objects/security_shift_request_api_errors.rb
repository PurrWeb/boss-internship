class SecurityShiftRequestApiErrors
  def initialize(security_shift_request:)
    @security_shift_request = security_shift_request
  end
  attr_reader :security_shift_request

  def errors
    result = {}
    result[:base] = security_shift_request.errors[:base] if security_shift_request.errors[:base].present?
    result[:creator] = security_shift_request.errors[:creator] if security_shift_request.errors[:creator].present?
    result[:startsAt] = security_shift_request.errors[:starts_at] if security_shift_request.errors[:starts_at].present?
    result[:endsAt] = security_shift_request.errors[:ends_at] if security_shift_request.errors[:ends_at].present?
    result[:note] = security_shift_request.errors[:note] if security_shift_request.errors[:note].present?
    result[:state] = security_shift_request.errors[:state] if security_shift_request.errors[:state].present?

    result
  end
end
