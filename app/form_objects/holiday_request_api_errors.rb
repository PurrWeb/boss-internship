class HolidayRequestApiErrors
  def initialize(holiday_request:)
    @holiday_request = holiday_request
  end
  attr_reader :holiday_request

  def errors
    result = {}
    result[:base] = holiday_request.errors[:base] if holiday_request.errors[:base].present?
    result[:startDate] = holiday_request.errors[:start_date] if holiday_request.errors[:start_date].present?
    result[:endDate] = holiday_request.errors[:end_date] if holiday_request.errors[:end_date].present?

    result
  end
end
