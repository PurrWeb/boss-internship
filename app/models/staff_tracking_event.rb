class StaffTrackingEvent < ActiveRecord::Base
  CREATION_EVENT_TYPE = 'creation'
  DISABLE_EVENT_TYPE = 'disable'
  REENABLE_EVENT_TYPE = 're-enable'
  EVENT_TYPES = [CREATION_EVENT_TYPE, DISABLE_EVENT_TYPE, REENABLE_EVENT_TYPE]

  belongs_to :staff_member

  validates :staff_member, presence: true
  validates :event_type, inclusion: { in: EVENT_TYPES, message: 'is required' }
  validates :at, presence: true

  def self.creation_event
    where("(`#{table_name}`.event_type = ?) OR (`#{table_name}`.event_type = ?)", CREATION_EVENT_TYPE, DISABLE_EVENT_TYPE)
  end

  def self.deletion_event
    where(event_type: DISABLE_EVENT_TYPE)
  end
end
