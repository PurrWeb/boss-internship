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
      payslip_date = params[:start_date].present? && GetPayslipDate.new(item_date: params.fetch(:start_date)).call
      holiday = Holiday.new(params.merge(
        payslip_date: payslip_date
      ))
      holiday.validate_as_assignment = params[:validate_as_assignment]
      holiday.validate_as_creation = true
      success = holiday.save
    end

    Result.new(success, holiday)
  end

  private
  attr_reader :requester, :holiday, :params
end
