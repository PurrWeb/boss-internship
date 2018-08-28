class UpdateAccessoryRefundRequestPayslipDateApiErrors
  def initialize(accessory_refund_request:)
    @accessory_refund_request = accessory_refund_request
  end
  attr_reader :accessory_refund_request

  def errors
    result = {}
    result[:base] = accessory_refund_request.errors[:base] if accessory_refund_request.errors[:base].present?
    result[:payslipDate] = accessory_refund_request.errors[:payslip_date] if accessory_refund_request.errors[:payslip_date].present?
    result
  end
end

