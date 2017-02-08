class HolidayCapValidator
  PAID_HOLIDAY_DAY_CAP = 28

  def initialize(holiday)
    @holiday = holiday
    @now = Time.current
  end
  attr_reader :holiday, :now

  def validate
    if prerequisits_met?
      staff_member = holiday.staff_member

      paid_holidays_this_year = HolidayThisYearQuery.new(
        relation: staff_member.active_holidays.paid,
      ).count

      if (paid_holidays_this_year + holiday.days) > PAID_HOLIDAY_DAY_CAP
        holiday.errors.add(:base, HolidayCapValidator.cap_reached_error_message)
      end
    end
  end

  def prerequisits_met?
    holiday.validate_as_creation &&
      holiday.staff_member.present? &&
      holiday.start_date.present? &&
      holiday.end_date.present?
  end

  def self.cap_reached_error_message
    "Cap of #{PAID_HOLIDAY_DAY_CAP} holiday days reached"
  end
end
