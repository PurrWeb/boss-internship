class DeleteHoliday
  def initialize(requester:, holiday:)
    @requester = requester
    @holiday = holiday
  end

  def call
    holiday.disable!(requester: requester)
  end

  private
  attr_reader :requester, :holiday
end
