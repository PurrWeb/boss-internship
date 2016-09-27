class DailyReportStaffMemberListing < ActiveRecord::Base
  belongs_to :daily_report_staff_member_section, dependent: :destroy
  belongs_to :staff_member

  validates :daily_report_staff_member_section, presence: true
  validates :staff_member, presence: true
  validates :rotaed_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :actual_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :rotaed_hours, numericality: { greater_than_or_equal_to: 0 }
  validates :worked_hours, numericality: { greater_than_or_equal_to: 0 }
  validates :break_hours, numericality: { greater_than_or_equal_to: 0 }
  validates :pay_rate_name, presence: true
  validates :pay_rate_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :pay_rate_calculation_type, inclusion: { in: PayRate::CALCULATION_TYPES, message: 'is invalid' }
  validates_inclusion_of :pay_rate_admin, in: [true, false]
  validates :pay_rate_text_description_short, presence: true

  def pay_rate_hourly?
    pay_rate_calculation_type == PayRate::HOURLY_CALCULATION_TYPE
  end

  def pay_rate_admin?
    pay_rate_admin
  end
end
