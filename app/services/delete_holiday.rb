class DeleteHoliday
  class Result < Struct.new(:success, :holiday)
    def success?
      success
    end
  end

  def initialize(requester:, holiday:)
    @requester = requester
    @holiday = holiday
  end

  def call
    result = true
    if holiday.editable?
      ActiveRecord::Base.transaction do
        staff_member = holiday.staff_member
        payslip_week = RotaWeek.new(holiday.payslip_date)

        holiday.disable!(requester: requester)
        MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: payslip_week).call
      end
    else
      holiday.errors.add(:base, "can't delete holiday that has been frozen")
      result = false
    end

    Result.new(result, holiday)
  end

  private
  attr_reader :requester, :holiday
end
