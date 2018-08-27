class UpdateAccessoryRefundRequestPayslipDate
  class Result < Struct.new(:success, :accessory_refund_request, :api_errors)
    def success?
      success
    end
  end

  def initialize(accessory_refund_request:, new_payslip_date:, requester:)
    @accessory_refund_request = accessory_refund_request
    @new_payslip_date = new_payslip_date
    @ability = UserAbility.new(requester)
    @requester = requester
  end
  attr_reader :accessory_refund_request, :new_payslip_date, :requester, :ability

  def call
    ability.authorize!(:update_refund_payslip_date, :accessory_requests)
    result = false

    staff_member = accessory_refund_request.staff_member
    ActiveRecord::Base.transaction do
      old_payslip_date = accessory_refund_request.payslip_date
      result = accessory_refund_request.update_attributes(payslip_date: new_payslip_date)

      if result && staff_member.can_have_finance_reports?
        old_week = RotaWeek.new(old_payslip_date)
        new_week = RotaWeek.new(new_payslip_date)
        finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: old_week).call
        if old_week.start_date != new_week.start_date
          finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: new_week).call
        end

        accessory_refund_request.update_attributes!(finance_report: finance_report)
      end
    end

    api_errors = nil
    unless result
      api_errors = UpdateAccessoryRefundRequestPayslipDateApiErrors.new(accessory_refund_request: accessory_refund_request)
    end
    Result.new(result, accessory_refund_request, api_errors)
  end
end
