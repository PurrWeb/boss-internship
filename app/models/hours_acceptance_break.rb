class HoursAcceptanceBreak < ActiveRecord::Base
  belongs_to :hours_acceptance_period

  validates :hours_acceptance_period, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
end
