class UpdatePinCodeApiService
  Result = Struct.new(:success, :staff_member, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:)
    @requester = requester
    @staff_member = staff_member
  end

  def call(pin_code:)
    model_service_result = UpdatePinCode.new(
      staff_member: staff_member,
      requester: requester,
      pin_code: pin_code
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = PinCodeApiErrors.new(staff_member: model_service_result.staff_member)
    end
    Result.new(model_service_result.success?, model_service_result.staff_member, api_errors)
  end

  attr_reader :requester, :staff_member
end
