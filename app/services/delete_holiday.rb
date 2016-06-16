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
      holiday.disable!(requester: requester)
    else
      holiday.errors.add(:base, "can't delete holiday that has been frozen")
      result = false
    end

    Result.new(result, holiday)
  end

  private
  attr_reader :requester, :holiday
end
