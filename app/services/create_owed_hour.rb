class CreateOwedHour
  Result = Struct.new(:success, :owed_hour) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    owed_hour = nil

    ActiveRecord::Base.transaction do
      payslip_date = params[:date].present? && GetPayslipDate.new(item_date: params.fetch(:date)).call
      owed_hour = OwedHour.new(params.merge(
        payslip_date: payslip_date
      ))
      owed_hour.validate_as_creation = true
      success = owed_hour.save
    end

    Result.new(success, owed_hour)
  end

  private
  attr_reader :owed_hour, :params
end
