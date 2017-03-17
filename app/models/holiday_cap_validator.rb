class HolidayCapValidator
  PAID_HOLIDAY_DAY_CAP = 28

  def initialize(holiday)
    @holiday = holiday
    @today = Time.current.to_date
  end
  attr_reader :holiday, :today

  def validate
    if holiday.paid? && prerequisits_met?
      staff_member = holiday.staff_member

      tax_year = TaxYear.new(today)
      paid_holidays_this_year = HolidayInTaxYearQuery.new(
        relation: staff_member.active_holidays.paid,
        tax_year: tax_year
      ).day_count

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
