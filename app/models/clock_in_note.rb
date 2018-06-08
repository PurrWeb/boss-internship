class ClockInNote < ActiveRecord::Base
  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true

  validates :creator, presence: true
  validates :clock_in_day, presence: true
  validates :note, presence: true

  delegate :staff_member, :venue, :date, to: :clock_in_day
end
