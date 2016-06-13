class DeleteOldHour
  def initialize(requester:, old_hour:)
    @requester = requester
    @old_hour = old_hour
  end

  def call
    old_hour.disable!(requester: requester)
  end

  private
  attr_reader :requester, :old_hour
end
