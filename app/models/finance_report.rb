class FinanceReport < ActiveRecord::Base
  REPORT_STATUS_INCOMPLETE_STATUS = 'incomplete'
  REPORT_STATUS_READY_STATUS = 'ready'
  REPORT_STATUS_DONE_STATUS = 'done'

  belongs_to :staff_member
  belongs_to :venue

  validates :staff_member, presence: true
  validates :venue, presence: true
  validates :venue_name, presence: true
  validates :staff_member_name, presence: true
  validates :week_start, presence: true
  validates :pay_rate_description, presence: true
  validates :accessories_cents, presence: true
  validates :monday_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :tuesday_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :wednesday_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :thursday_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :friday_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :saturday_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :sunday_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :total_hours_count, numericality: { greater_than_or_equal_to: 0 }
  validates :owed_hours_minute_count, numericality: { greater_than_or_equal_to: 0 }
  validates :total_cents, numericality: { greater_than_or_equal_to: 0 }
  validates :holiday_days_count, numericality: { greater_than_or_equal_to: 0 }
  validate  :week_start_valid

  def total
    (total_cents && total_cents / 100.0) || 0
  end

  def owed_hours_count
   (owed_hours_minute_count && owed_hours_minute_count / 60.0) || 0
  end

  def net_wages_cents
    wage_payments.sum(:cents)
  end

  def wage_payments
    InRangeQuery.new(
      relation: Payment.enabled.where(staff_member: staff_member),
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all
  end

  def week
    RotaWeek.new(week_start)
  end

  #validation
  def week_start_valid
    return unless week_start.present?
    if RotaWeek.new(week_start).start_date != week_start
      errors.add(:week_start, 'must be at start of week')
    end
  end
end
