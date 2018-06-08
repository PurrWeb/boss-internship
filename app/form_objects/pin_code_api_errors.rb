class PinCodeApiErrors
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}
    result[:pinCode] = staff_member.errors[:pin_code] if staff_member.errors[:pin_code].present?

    result
  end
end
