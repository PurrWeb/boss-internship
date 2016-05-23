class ClockInDay < ActiveRecord::Base
  belongs_to :venue
  belongs_to :staff_member
  belongs_to :creator, polymorphic: true

  validates :date, presence: true
  validates :staff_member, presence: true
  validates :venue, presence: true
  validates :creator, presence: true
end
