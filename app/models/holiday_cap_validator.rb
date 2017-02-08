class HolidayCapValidator
  PAID_HOLIDAY_DAY_CAP = 28

  def initialize(holiday)
    @holiday = holiday
    @now = Time.current
  end
  attr_reader :holiday, :now

  def validate
    if holiday.validate_as_creation && holiday.staff_member.present?
      staff_member = holiday.staff_member
      query = PaidHolidaysInTaxYearQuery.new(staff_member: staff_member, date: now.to_date)
      paid_holidays_this_year = query.count

      if paid_holidays_this_year >= PAID_HOLIDAY_DAY_CAP
        holiday.errors.add(:base, HolidayCapValidator.cap_reached_error_message)
      end
    end
  end

  def self.cap_reached_error_message
    "Cap of #{PAID_HOLIDAY_DAY_CAP} holiday days reached"
  end
end
