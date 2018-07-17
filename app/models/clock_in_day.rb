class ClockInDay < ActiveRecord::Base
  belongs_to :venue
  belongs_to :staff_member
  belongs_to :creator, polymorphic: true
  has_many :clock_in_periods
  has_many :hours_acceptance_periods
  has_many :clock_in_notes

  validates :date, presence: true
  validates :staff_member, presence: true
  validates :venue, presence: true
  validates :creator, presence: true

  def current_clock_in_state
    case last_clock_in_event.andand.event_type
    when 'clock_in'
      :clocked_in
    when 'clock_out'
      :clocked_out
    when 'start_break'
      :on_break
    when 'end_break'
      :clocked_in
    when nil
      :clocked_out
    else
      raise "Usupported event type encountered :#{last_event.event_type}"
    end
  end

  def last_clock_in_event
    clock_in_periods.last.andand.clock_in_events.andand.last
  end
end
