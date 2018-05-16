class SecurityVenueShift < ActiveRecord::Base
  belongs_to :staff_member
  belongs_to :security_venue
  belongs_to :creator_user, class_name: "User"
  belongs_to :disabled_by_user, class_name: "User"

  SHIFT_VENUE_TYPE = "security".freeze

  validates :date, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :times_in_correct_order
  validate :times_within_date_boundary
  validate :times_in_fifteen_minute_increments

  validate do |security_venue_shift|
    SecurityVenueShiftTimeOverlapValidator.new(security_venue_shift).validate
  end

  validate do |security_venue_shift|
    NotOnHolidayValidator.new(security_venue_shift).validate
  end

  scope :enabled, -> { where({disabled_at: nil, disabled_by_user: nil}) }

  def disabled?
    disabled_at.present? && disabled_by_user.present?
  end

  def enabled?
    !disabled?
  end

  def venue_type
    SHIFT_VENUE_TYPE
  end

  private
  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:base, 'starts time must be after end time') if starts_at >= ends_at
    end
  end

  # validation
  def times_within_date_boundary
    if date.present?
      if starts_at.present? && (starts_at < RotaShiftDate.new(date).start_time)
        raise "starts at time #{starts_at} suppiled too early for rota on #{date}"
      end

      if ends_at.present? && (ends_at < RotaShiftDate.new(date).start_time)
        raise "ends at time #{ends_at} suppiled too early for rota on #{date}"
      end

      if starts_at.present? && (starts_at > RotaShiftDate.new(date).end_time)
        raise "starts_at time #{starts_at} suppiled too late for rota on #{date}"
      end

      if ends_at.present? && (ends_at > RotaShiftDate.new(date).end_time)
        raise "ends_at time #{ends_at} suppiled too late for rota on #{date}"
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
