class CompleteAccessoryRequest
  Result = Struct.new(:success, :accessory_request) do
    def success?
      success
    end
  end

  def initialize(accessory_request:, requester:)
    @accessory_request = accessory_request
    @requester = requester
  end

  def call
    complete_success = false
    restock_success = false
    finance_report_success = false

    accessory = accessory_request.accessory
    last_count = accessory.accessory_restocks.last.andand.count || 0
    delta = -1
    current_count = last_count + delta
    staff_member = accessory_request.staff_member

    week = RotaWeek.new(
      GetPayslipDate.new(item_date: RotaShiftDate.to_rota_date(now)).call
    )

    ActiveRecord::Base.transaction do
      finance_report = nil

      if staff_member.can_have_finance_reports?
        finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week).call
      end

      complete_success = accessory_request.transition_to!(:completed, requster_user_id: requester.id)

      if finance_report.present?
        finance_report_success = accessory_request.update(finance_report: finance_report)
      end

      restock_params = {
        accessory: accessory,
        count: current_count,
        delta: delta,
        created_by_user: requester,
        accessory_request: accessory_request
      }

      accessory_restock_result = CreateAccessoryRestock.new(params: restock_params).call

      raise ActiveRecord::Rollback unless complete_success && accessory_restock_result.success? && finance_report_success
    end

    Result.new(complete_success && accessory_restock_result.success? && finance_report_success, accessory_request)
  end

  private
  attr_reader :accessory_request, :requester
end
