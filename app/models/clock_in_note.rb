class ClockInNote < ActiveRecord::Base
  belongs_to :creator, polymorphic: true
  belongs_to :venue
  belongs_to :staff_member

  validates :creator, presence: true
  validates :venue, presence: true
  validates :staff_member, presence: true
  validates :note, presence: true
end
