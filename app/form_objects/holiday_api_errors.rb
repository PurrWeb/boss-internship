class HolidayApiErrors
  def initialize(holiday:)
    @holiday = holiday
  end
  attr_reader :holiday

  def errors
    result = {}
    result[:base] = holiday.errors[:base] if holiday.errors[:base].present?
    result[:creator] = holiday.errors[:creator] if holiday.errors[:creator].present?
    result[:staffMember] = holiday.errors[:staff_member] if holiday.errors[:staff_member].present?
    result[:startDate] = holiday.errors[:start_date] if holiday.errors[:start_date].present?
    result[:endDate] = holiday.errors[:end_date] if holiday.errors[:end_date].present?
    result[:payslipDate] = holiday.errors[:payslip_date] if holiday.errors[:payslip_date].present?
    result[:holidayType] = holiday.errors[:holiday_type] if holiday.errors[:holiday_type].present?

    result
  end
end
