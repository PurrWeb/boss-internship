class TimeDodgerOffence < ActiveRecord::Base
  HARD_DODGER_MINUTE_THRESHOLD = 45 * 60
  SOFT_DODGER_MINUTE_THRESHOLD = 47 * 60

  belongs_to :staff_member

  scope :soft_dodgers, -> { where('`minutes` >= ? AND `minutes` <= ?', HARD_DODGER_MINUTE_THRESHOLD, SOFT_DODGER_MINUTE_THRESHOLD) }
  scope :hard_dodgers, -> { where('`minutes` < ?', HARD_DODGER_MINUTE_THRESHOLD) }
  scope :dodgers, -> { where('`minutes` < ?', SOFT_DODGER_MINUTE_THRESHOLD) }
  scope :by_week, -> (week) { where(week_start: week.start_date) }

  validates :staff_member, presence: true
  validates :week_start, presence: true
  validates :minutes, presence: true
  validates :accepted_hours, presence: true
  validates :paid_holidays, presence: true
  validates :owed_hours, presence: true
  validates :accepted_breaks, presence: true
end
