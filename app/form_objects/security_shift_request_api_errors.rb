class SecurityShiftRequestApiErrors
  def initialize(security_shift_request:)
    @security_shift_request = security_shift_request
    @created_shift = security_shift_request.created_shift
  end
  attr_reader :security_shift_request, :created_shift

  def errors
    result = {}
    result[:base] = security_shift_request.errors[:base] if security_shift_request.errors[:base].present?
    result[:creator] = security_shift_request.errors[:creator] if security_shift_request.errors[:creator].present?
    result[:startsAt] = security_shift_request.errors[:starts_at] if security_shift_request.errors[:starts_at].present?
    result[:endsAt] = security_shift_request.errors[:ends_at] if security_shift_request.errors[:ends_at].present?
    result[:note] = security_shift_request.errors[:note] if security_shift_request.errors[:note].present?
    result[:state] = security_shift_request.errors[:state] if security_shift_request.errors[:state].present?
    result[:rejectReason] = security_shift_request.errors[:reject_reason] if security_shift_request.errors[:reject_reason].present?

    if created_shift.present?
      result[:base] = created_shift.errors[:base] if created_shift.errors[:base].present?
    end

    result
  end
end
