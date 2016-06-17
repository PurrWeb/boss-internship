class DeleteOwedHour
  class Result < Struct.new(:success, :owed_hour)
    def success?
      success
    end
  end

  def initialize(requester:, owed_hour:)
    @requester = requester
    @owed_hour = owed_hour
  end

  def call
    result = true
    if owed_hour.editable?
      owed_hour.disable!(requester: requester)
    else
      owed_hour.errors.add(:base, "can't delete owed hour that has been frozen")
      result = false
    end

    Result.new(result, owed_hour)
  end

  private
  attr_reader :requester, :owed_hour
end
