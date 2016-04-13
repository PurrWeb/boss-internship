class FruitOrdersDeadline
  def self.get_next(time:)
    [next_tuesday_deadline(time: time), next_friday_deadline(time: time)].min
  end

  def self.get_previous(time:)
    [previous_tuesday_deadline(time: time), previous_friday_deadline(time: time)].max
  end

  def self.previous_tuesday_deadline(time:)
    tuesday_deadline_this_week = time.
      beginning_of_week.
      advance(days: 1).
      change(hour: 02, minute: 0, second: 0)

    tuesday_deadline_previous_week = time.
      prev_week.
      advance(days: 1).
      change(hour: 02, minute: 0, second: 0)

    time > tuesday_deadline_this_week ?
      tuesday_deadline_this_week :
      tuesday_deadline_previous_week
  end

  def self.next_tuesday_deadline(time:)
    tuesday_deadline_this_week = time.
      beginning_of_week.
      advance(days: 1).
      change(hour: 02, minute: 0, second: 0)

    tuesday_deadline_next_week = time.
      next_week.
      advance(days: 1).
      change(hour: 02, minute: 0, second: 0)

    time < tuesday_deadline_this_week ?
      tuesday_deadline_this_week :
      tuesday_deadline_next_week
  end

  def self.next_friday_deadline(time:)
    friday_deadline_this_week = time.
      beginning_of_week.
      advance(days: 4).
      change(hour: 02, minute: 0, second: 0)

    friday_deadline_next_week = time.
      next_week.
      advance(days: 4).
      change(hour: 02, minute: 0, second: 0)

    time < friday_deadline_this_week ?
      friday_deadline_this_week :
      friday_deadline_next_week
  end

  def self.previous_friday_deadline(time:)
    friday_deadline_this_week = time.
      beginning_of_week.
      advance(days: 4).
      change(hour: 02, minute: 0, second: 0)

    friday_deadline_previous_week = time.
      prev_week.
      advance(days: 4).
      change(hour: 02, minute: 0, second: 0)

    time > friday_deadline_this_week ?
      friday_deadline_this_week :
      friday_deadline_previous_week
  end
end
