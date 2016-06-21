class OwedHour < ActiveRecord::Base
  belongs_to :staff_member
  belongs_to :creator, class_name: 'User', foreign_key: :creator_user_id
  belongs_to :parent, class_name: 'OwedHour', foreign_key: :parent_owed_hour_id
  belongs_to :disabled_by, class_name: 'User', foreign_key: :disabled_by_user_id
  belongs_to :frozen_by, class_name: 'FinanceReport', foreign_key: 'frozen_by_finance_report_id'

  validates :week_start_date, presence: true
  validates :minutes, numericality: { greater_than: 0 }
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :note, presence: true
  validates :disabled_by, presence: true, if: :disabled?

  validate :week_start_date_valid

  attr_accessor :validate_as_creation

  #validation
  def week_start_date_valid
    return unless week_start_date.present?

    week = RotaWeek.new(week_start_date)
    if week.start_date != week_start_date
      errors.add(:week_start_date, 'must be at start of week')
    end

    if validate_as_creation
      if week.week_status == :past
        errors.add(:base, "can't create owed hours in the past")
        return
      end
    elsif week_start_date_changed? && week.week_status == :past
      errors.add(:week_start_date, "can't be changed to date in the past")
      return
    end
  end

  def editable?
    staff_member.enabled? && !frozen?
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
