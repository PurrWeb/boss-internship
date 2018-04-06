class RotaShiftApiErrors
  def initialize(rota_shift:)
    @rota_shift = rota_shift
  end
  attr_reader :rota_shift

  def errors
    result = {}
    result[:base] = rota_shift.errors[:base] if rota_shift.errors[:base].present?
    result[:startsAt] = rota_shift.errors[:starts_at] if rota_shift.errors[:starts_at].present?
    result[:endsAt] = rota_shift.errors[:ends_at] if rota_shift.errors[:ends_at].present?
    result[:staffMember] = rota_shift.errors[:staff_member] if rota_shift.errors[:staff_member].present?
    result[:rota] = rota_shift.errors[:rota] if rota_shift.errors[:rota].present?

    result
  end
end
