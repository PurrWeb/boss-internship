class CreateOwedHour
  Result = Struct.new(:success, :owed_hour) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call(now: Time.current)
    success = false
    owed_hour = nil

    ActiveRecord::Base.transaction do
      payslip_date = params[:date].present? && GetPayslipDate.new(item_date: params.fetch(:date)).call(now: now)
      owed_hour = OwedHour.new(params.merge(
        payslip_date: payslip_date
      ))
      owed_hour.validate_as_creation = true
      staff_member = owed_hour.staff_member
      week = RotaWeek.new(payslip_date)
      finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week).call

      success = owed_hour.update_attributes(finance_report: finance_report)
      raise ActiveRecord::Rollback unless success


    end

    Result.new(success, owed_hour)
  end

  private
  attr_reader :owed_hour, :params
end
