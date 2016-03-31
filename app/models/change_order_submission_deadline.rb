class ChangeOrderSubmissionDeadline
  def initialize(week:)
    @week = week
  end

  def self.from_deadline_date(dealine_date)
    week = RotaWeek.new(dealine_date - 1.day)
    new(week: week)
  end

  def time
    RotaWeek.new(week.start_date + 1.week).
      start_date.
      beginning_of_day + 8.hours
  end

  def past?(now: Time.now)
    now > time
  end

  def notification_time
    time - 6.hours
  end

  def in_notification_period?(now)
    now >= notification_time && now <= time
  end

  private
  attr_reader :week
end
