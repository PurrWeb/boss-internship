class OwedHour < ActiveRecord::Base
  belongs_to :staff_member
  belongs_to :creator, class_name: 'User', foreign_key: :creator_user_id
  belongs_to :parent, class_name: 'OwedHour', foreign_key: :parent_owed_hour_id
  belongs_to :disabled_by, class_name: 'User', foreign_key: :disabled_by_user_id
  belongs_to :frozen_by, class_name: 'FinanceReport', foreign_key: 'frozen_by_finance_report_id'

  validates :date, presence: true
  validates :minutes, numericality: { greater_than: 0 }
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :note, presence: true
  validates :disabled_by, presence: true, if: :disabled?

  validate :date_valid
  validate :times_valid
  validate :minutes_valid_for_times

  attr_accessor :validate_as_creation

  #validation
  def date_valid
    return unless date.present?

    current_date = RotaShiftDate.to_rota_date(Time.current)
    if date > current_date
      errors.add(:date, "can't be in the future")
    end
  end

  #validation
  def times_valid
    return unless date.present?
    return unless require_times
    shift_date = RotaShiftDate.new(date)

    if !starts_at.present?
      errors.add(:starts_at, 'must by supplied')
    elsif !ends_at.present?
      errors.add(:ends_at, 'must be supplied')
    end

    if starts_at.present? && !shift_date.contains_time?(starts_at)
      errors.add(:starts_at, 'not valid for date')
    end
    if ends_at.present? && !shift_date.contains_time?(ends_at)
      errors.add(:ends_at, 'not valid for date')
    end
  end

  #validatation
  def minutes_valid_for_times
    return unless minutes.present? && starts_at.present? && ends_at.present?

    times_delta_minutes = (ends_at - starts_at) / 60
    if times_delta_minutes != minutes
      errors.add(:minutes, 'must match times')
    end
  end

  def has_times?
    starts_at.present? && ends_at.present?
  end

  def editable?
    staff_member.enabled? && !frozen?
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

  def frozen?
    frozen_by.present?
  end
end
