class UpdateAccessoryRequestPayslipDateApiErrors
  def initialize(accessory_request:)
    @accessory_request = accessory_request
  end
  attr_reader :accessory_request

  def errors
    result = {}
    result[:base] = accessory_request.errors[:base] if accessory_request.errors[:base].present?
    result[:payslipDate] = accessory_request.errors[:payslip_date] if accessory_request.errors[:payslip_date].present?
    result
  end
end

