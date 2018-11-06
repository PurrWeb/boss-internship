class ClockInPeriod < ActiveRecord::Base
  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  has_many :clock_in_events
  has_many :clock_in_breaks

  validates_associated :clock_in_breaks
  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :starts_at, presence: true
  include ClockInPeriodTimeValidations

  delegate :venue, :date, :staff_member, :clock_in_notes, to: :clock_in_day

  def times_overlap_validations
    ClockInPeriodTimeOverlapValidator.new(self).validate
  end

  def self.enabled
    all
  end

  def self.incomplete
    where(ends_at: nil)
  end

  def enabled?
    true
  end

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

  private
  def last_clock_in_event
    clock_in_events.andand.last
  end
end
