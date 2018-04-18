class HolidayRequestApiErrors
  def initialize(holiday_request:, holiday: nil)
    @holiday_request = holiday_request
    @holiday = holiday
  end
  attr_reader :holiday, :holiday_request

  def errors
    result = {}

    if holiday_request.errors[:base].present?
      result[:base] ||= []
      holiday_request.errors[:base].each do |error|
        result[:base] << error
      end
    end

    if holiday.present? && holiday.errors[:base].present?
      result[:base] ||= []
      holiday.errors[:base].each do |error|
        result[:base] << error
      end
    end

    result[:startDate] = holiday_request.errors[:start_date] if holiday_request.errors[:start_date].present?
    result[:endDate] = holiday_request.errors[:end_date] if holiday_request.errors[:end_date].present?

    result
  end
end
