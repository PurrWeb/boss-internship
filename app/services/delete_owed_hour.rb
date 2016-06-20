class DeleteOwedHour
  def initialize(requester:, owed_hour:)
    @requester = requester
    @owed_hour = owed_hour
  end

  def call
    owed_hour.disable!(requester: requester)
  end

  private
  attr_reader :requester, :owed_hour
end
