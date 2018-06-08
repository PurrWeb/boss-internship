class UpdatePinCode
  Result = Struct.new(:success, :staff_member) do
    def success?
      success
    end
  end

  def initialize(staff_member:, pin_code:, requester:)
    @staff_member = staff_member
    @pin_code = pin_code
    @requester = requester
  end

  def call
    success = false

    ActiveRecord::Base.transaction do
      success = staff_member.update(pin_code: pin_code)
    end

    Result.new(success, staff_member)
  end

  private
  attr_reader :staff_member, :pin_code, :requester
end
