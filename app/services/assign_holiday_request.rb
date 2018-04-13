class AssignHolidayRequest
  class Result < Struct.new(:success, :holiday_request)
    def success?
      success
    end
  end

  def initialize(holiday_request:, holiday:)
    @holiday_request = holiday_request
    @holiday = holiday
  end

  def call
    result = true
    if holiday_request.accepted? && check_holiday
      holiday_request.update(created_holiday: holiday)
    else
      holiday_request.errors.add(:base, "can't assign holiday request, holiday request are not in accepted status")
      result = false
    end

    Result.new(result, holiday_request)
  end

  private
  def attributes
    [:start_date, :end_date, :holiday_type, :note]
  end

  def check_holiday
    result = true
    attributes.each do |attribute|
      unless holiday.send(attribute) == holiday_request.send(attribute)
        result = false
        holiday_request.errors.add(:base, " #{attribute}: Not match with HolidayRequest")
      end
    end
    result
  end

  attr_reader :holiday_request, :holiday
end
