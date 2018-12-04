class TimeDodgerOffence < ActiveRecord::Base
  TIME_DODGERS_START_LIMIT = 45 * 60
  TIME_DODGERS_END_LIMIT = 47 * 60

  belongs_to :staff_member

  scope :soft_dodgers, -> { where('`minutes` >= ? AND `minutes` <= ?', TIME_DODGERS_START_LIMIT, TIME_DODGERS_END_LIMIT) }
  scope :hard_dodgers, -> { where('`minutes` < ?', TIME_DODGERS_START_LIMIT) }
  scope :dodgers, -> { where('`minutes` < ?', TIME_DODGERS_END_LIMIT) }
  scope :by_week, -> (week) { where(week_start: week.start_date) }
end
