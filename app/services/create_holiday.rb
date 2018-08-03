class CreateHoliday
  Result = Struct.new(:success, :holiday) do
    def success?
      success
    end
  end

  def initialize(requester:,  params:)
    @requester = requester
    @params = params
  end

  def call
    success = false
    holiday = nil
    ActiveRecord::Base.transaction do
      start_date_from_params = params[:start_date]
      staff_member_from_params = params[:staff_member]
      payslip_date = start_date_from_params.present? && GetPayslipDate.new(item_date: start_date_from_params).call
      holiday = Holiday.new(params.merge(
        payslip_date: payslip_date
      ))
      holiday.validate_as_assignment = params[:validate_as_assignment]
      holiday.validate_as_creation = true

      finance_report = nil
      if staff_member_from_params.present? && payslip_date.present?
        payslip_week = RotaWeek.new(payslip_date)
        finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member_from_params, week: payslip_week).call
      end

      success = holiday.update_attributes(finance_report: finance_report)
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, holiday)
  end

  private
  attr_reader :requester, :holiday, :params
end
