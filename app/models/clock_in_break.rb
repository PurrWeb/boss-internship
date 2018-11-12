class ClockInBreak < ActiveRecord::Base
  belongs_to :clock_in_period

  validates :clock_in_period, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true

  include ClockInBreakTimeValidations

  def disabled?
    false
  end
end
