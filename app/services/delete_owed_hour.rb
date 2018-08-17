class DeleteOwedHour
  class Result < Struct.new(:success, :owed_hour)
    def success?
      success
    end
  end

  def initialize(requester:, owed_hour:)
    @requester = requester
    @owed_hour = owed_hour
  end

  def call
    result = true
    if owed_hour.editable?
      staff_member = owed_hour.staff_member
      payslip_week = RotaWeek.new(owed_hour.payslip_date)

      ActiveRecord::Base.transaction do
        owed_hour.disable!(requester: requester)

        if staff_member.can_have_finance_reports?
          MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: payslip_week).call
        end
      end
    else
      owed_hour.errors.add(:base, "can't delete owed hour that has been frozen")
      result = false
    end

    Result.new(result, owed_hour)
  end

  private
  attr_reader :requester, :owed_hour
end
