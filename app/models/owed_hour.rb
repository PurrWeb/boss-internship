class OwedHour < ActiveRecord::Base
  CONFLICTING_HOLIDAYS_VALIDATION_MESSAGE = 'conflicting holiday exists'
  CONFLICTING_HOLIDAY_REQUESTS_VALIDATION_MESSAGE = 'conflicting holiday request exists'
  CONFLICTING_HAP_PERIOD_VALIDATION_MESSAGE = 'conflicting hour acceptance exists'
  CONFLICTING_OWED_HOURS_VALIDATION_MESSAGE = 'conflicting owed hour exists'

  belongs_to :staff_member
  belongs_to :creator, class_name: 'User', foreign_key: :creator_user_id
  belongs_to :parent, class_name: 'OwedHour', foreign_key: :parent_owed_hour_id
  belongs_to :disabled_by, class_name: 'User', foreign_key: :disabled_by_user_id
  belongs_to :finance_report

  validates :date, presence: true
  validates :minutes, numericality: { greater_than: 0 }
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :note, presence: true
  validates :disabled_by, presence: true, if: :disabled?
  validates :payslip_date, presence: true, if: :requires_finance_report?
  validates :finance_report, presence: true, if: :requires_finance_report?

  validate :date_valid
  validate :times_valid
  validate :minutes_valid_for_times
  validate :no_time_conflicts
  validate do |owed_hour|
    PayslipDateValidator.new(item: owed_hour).validate_all
  end

  attr_accessor :validate_as_creation

  def requires_finance_report?
    !allow_no_finance_report &&
      staff_member.present? &&
      staff_member.can_have_finance_reports? &&
      enabled?
  end

  #validation
  def date_valid
    return unless enabled? && date.present?

    current_date = RotaShiftDate.to_rota_date(Time.current)
    if date > current_date
      errors.add(:date, "can't be in the future")
    end
  end

  #validation
  def times_valid
    return unless enabled? && require_times

    if !starts_at.present?
      errors.add(:starts_at, "can't be blank")
    end
    if !ends_at.present?
      errors.add(:ends_at, "can't be blank")
    end

    if date.present?
      shift_date = RotaShiftDate.new(date)

      if starts_at.present? && !shift_date.contains_time?(starts_at)
        errors.add(:starts_at, 'not valid for date')
      end
      if ends_at.present? && !shift_date.contains_time?(ends_at)
        errors.add(:ends_at, 'not valid for date')
      end
    end
  end

  #validatation
  def minutes_valid_for_times
    return unless enabled? && minutes.present? && starts_at.present? && ends_at.present?

    times_delta_minutes = (ends_at - starts_at) / 60
    if times_delta_minutes != minutes
      errors.add(:minutes, 'must match times')
    end
  end

  #validation
  def no_time_conflicts
    return unless (
      enabled?  &&
      staff_member.present? &&
      has_times?
    )

    if !allow_legacy_conflicting_owed_hours?
      staff_member_active_owed_hours = staff_member.active_owed_hours
      if persisted?
        staff_member_active_owed_hours = staff_member_active_owed_hours.
          where("id != ?", id)
      end

      conflicting_owed_hours = InRangeQuery.new(
        relation: staff_member_active_owed_hours,
        start_value: starts_at,
        end_value: ends_at
      ).all

      if conflicting_owed_hours.count > 0
        errors.add(:base, CONFLICTING_OWED_HOURS_VALIDATION_MESSAGE)
      end
    end

    if !allow_legacy_conflicting_holiday?
      conflicting_holidays = InRangeQuery.new(
        relation: staff_member.active_holidays,
        start_value: date,
        end_value: date,
        start_column_name: 'start_date',
        end_column_name: 'end_date'
      ).all

      if conflicting_holidays.count > 0
        errors.add(:base, CONFLICTING_HOLIDAYS_VALIDATION_MESSAGE)
      end
    end

    if !allow_legacy_conflicting_holiday_request?
      conflicting_holiday_requests = InRangeQuery.new(
        relation: staff_member.holiday_requests.enabled,
        start_value: date,
        end_value: date,
        start_column_name: 'start_date',
        end_column_name: 'end_date'
      ).all

      if conflicting_holiday_requests.count > 0
        errors.add(:base, CONFLICTING_HOLIDAY_REQUESTS_VALIDATION_MESSAGE)
      end
    end

    if !allow_legacy_overlap_accepted_hours?
      conflicting_hours_acceptances = InRangeQuery.new(
        relation: HoursAcceptancePeriod.
          accepted.
          joins(:clock_in_day).
          where(
            clock_in_days: { staff_member_id: staff_member }
          ),
        start_value: starts_at,
        end_value: ends_at
      ).all

      if conflicting_hours_acceptances.count > 0
        errors.add(:base, CONFLICTING_HAP_PERIOD_VALIDATION_MESSAGE)
      end
    end
  end

  def has_times?
    starts_at.present? && ends_at.present?
  end

  def editable?
    staff_member.enabled? && !boss_frozen?
  end

  def enabled?
    !disabled?
  end

  def disabled?
    disabled_at.present?
  end

  def disable!(requester:)
    update_attributes!(
      disabled_at: Time.current,
      disabled_by: requester
    )
  end

  def self.enabled
    where(disabled_at: nil)
  end

  def count
    if minutes.present?
      minutes / 60.0
    else
      0.0
    end
  end

  def boss_frozen?
    !!finance_report.andand.done?
  end
end
