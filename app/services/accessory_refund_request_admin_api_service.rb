class AccessoryRefundRequestAdminApiService
  Result = Struct.new(:success, :accessory_refund_request, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requster_user:, accessory_refund_request:)
    @requster_user = requster_user
    @accessory_refund_request = accessory_refund_request
  end

  def accept
    result = true
    if accessory_refund_request.frozen?
      accessory_refund_request.errors.add(:base, "can't accept refund for accessory request that has been frozen")
      result = false
    else
      result = accessory_refund_request.transition_to!(:accepted, requster_user_id: requster_user.id)
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRefundRequestApiErrors.new(accessory_refund_request: accessory_refund_request)
    end
    Result.new(result, accessory_refund_request, api_errors)
  end

  def reject
    result = true
    if accessory_refund_request.frozen?
      accessory_refund_request.errors.add(:base, "can't reject refund for accessory request that has been frozen")
      result = false
    else
      result = accessory_refund_request.transition_to!(:rejected, requster_user_id: requster_user.id)
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRefundRequestApiErrors.new(accessory_refund_request: accessory_refund_request)
    end
    Result.new(result, accessory_refund_request, api_errors)
  end

  def undo
    result = true
    if accessory_refund_request.frozen?
      accessory_refund_request.errors.add(:base, "can't undo accessory request that has been frozen")
      result = false
    else
      result = accessory_refund_request.transition_to!(:pending, requster_user_id: requster_user.id)
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRefundRequestApiErrors.new(accessory_refund_request: accessory_refund_request)
    end
    Result.new(result, accessory_refund_request, api_errors)
  end

  def complete(reusable:, now: Time.current)
    result = true
    if accessory_refund_request.frozen?
      accessory_refund_request.errors.add(:base, "can't complete accessory request that has been frozen")
      result = false
    else
      ActiveRecord::Base.transaction do
        staff_member = accessory_refund_request.staff_member
        week = RotaWeek.new(
          GetPayslipDate.new(item_date: RotaShiftDate.to_rota_date(now)).call
        )
        finance_report = nil
        if staff_member.can_have_finance_reports?
          finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week).call
        end

        accessory_refund_request.transition_to!(:completed, requster_user_id: requster_user.id)

        if finance_report.present?
          result = accessory_refund_request.update_attributes(finance_report: finance_report)
        else
          result = accessory_refund_request.save
        end

        if result && reusable
          accessory = accessory_refund_request.accessory_request.accessory
          last_count = accessory.accessory_restocks.last.andand.count || 0
          delta = 1
          current_count = last_count + delta
          staff_member = accessory_refund_request.staff_member

          restock_params = {
            accessory: accessory,
            count: current_count,
            delta: delta,
            created_by_user: requster_user,
            accessory_request: accessory_refund_request.accessory_request,
          }

          accessory_restock_result = CreateAccessoryRestock.new(params: restock_params).call
          result = accessory_restock_result.success?
        end

        raise ActiveRecord::Rollback unless result
      end
    end

    api_errors = nil
    unless result
      api_errors = AccessoryRefundRequestApiErrors.new(accessory_refund_request: accessory_refund_request)
    end
    Result.new(result, accessory_refund_request, api_errors)
  end

  attr_reader :requster_user, :ability, :accessory_refund_request
end
