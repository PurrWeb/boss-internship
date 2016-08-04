class StaffTrackingEvent < ActiveRecord::Base
  EVENT_TYPES = ['creation', 'disable', 're-enable']

  belongs_to :staff_member

  validates :staff_member, presence: true
  validates :event_type, inclusion: { in: EVENT_TYPES, message: 'is required' }
  validates :at, presence: true
end
