class ChangeOrderSubmissionDeadline
  def initialize(date:)
    @date = date
  end

  def time
    RotaWeek.new(date + 1.week).
      start_date.
      beginning_of_day + 8.hours
  end

  def past?(now: Time.now)
    now > time
  end

  private
  attr_reader :date
end
