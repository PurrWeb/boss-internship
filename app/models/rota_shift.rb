class RotaShift < ActiveRecord::Base
  SHIFT_TYPES = ['normal', 'standby']
  include Enableable

  SHIFT_VENUE_TYPE = "normal".freeze

  belongs_to :creator, class_name: "User"
  belongs_to :disabled_by_user, class_name: "User"
  belongs_to :staff_member
  belongs_to :rota
  has_one :security_shift_request, foreign_key: "created_shift_id", class_name: "SecurityShiftRequest"

  validates :shift_type, inclusion: { in: SHIFT_TYPES, message: 'is required' }
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :rota, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :times_in_correct_order
  validate :times_within_rota_boundary
  validate :times_in_fifteen_minute_increments
  validate do |rota_shift|
    ShiftTimeOverlapValidator.new(rota_shift).validate if enabled?
  end
  validate do |rota_shift|
    NotOnHolidayValidator.new(rota_shift).validate if enabled?
  end

  def date
    rota.andand.date
  end

  def venue_type
    SHIFT_VENUE_TYPE
  end

  def venue
    rota.andand.venue
  end

  def part_of_forecast?
    rota.andand.has_forecasts?
  end

  def rota_published?
    rota.andand.published?
  end

  def total_hours
    if ends_at.present? && starts_at.present? && ends_at > starts_at
      (ends_at - starts_at).seconds / 60 / 60
    end
  end

  def security?
    staff_member.security?
  end

  def standby?
    shift_type == 'standby'
  end

  private
  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:base, 'starts time must be after end time') if starts_at >= ends_at
    end
  end

  # validation
  def times_within_rota_boundary
    if rota.present?
      if starts_at.present? && (starts_at < RotaShiftDate.new(rota.date).start_time)
        raise "starts at time #{starts_at} suppiled too early for rota on #{rota.date}"
      end

      if ends_at.present? && (ends_at < RotaShiftDate.new(rota.date).start_time)
        raise "ends at time #{ends_at} suppiled too early for rota on #{rota.date}"
      end

      if starts_at.present? && (starts_at > RotaShiftDate.new(rota.date).end_time)
        raise "starts_at time #{starts_at} suppiled too late for rota on #{rota.date}"
      end

      if ends_at.present? && (ends_at > RotaShiftDate.new(rota.date).end_time)
        raise "ends_at time #{ends_at} suppiled too late for rota on #{rota.date}"
      end
    end
  end

  # validation
  def times_in_fifteen_minute_increments
    [:starts_at, :ends_at].each do |field|
      time = public_send(field)
      if time.present?
        minute = Integer(time.strftime('%M'))
        if ![0, 30].include?(minute)
          errors.add(field, 'must be 30 minute intervals')
        end
      end
    end
  end
end
