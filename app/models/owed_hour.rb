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

  attr_accessor :validate_as_creation

  #validation
  def date_valid
    return unless date.present?
    date_past = date < RotaShiftDate.to_rota_date(Time.current)

    if validate_as_creation && date_past
      errors.add(:date, "can't create owed hours in the past")
    elsif date_changed? && date_past
      errors.add(:date, "can't be changed to date in the past")
    end
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
