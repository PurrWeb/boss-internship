class DailyReportStaffMemberSection < ActiveRecord::Base
  belongs_to :staff_type
  belongs_to :daily_report, inverse_of: :staff_member_sections
  has_many :staff_member_listings, class_name: "DailyReportStaffMemberListing", inverse_of: :daily_report_staff_member_section

  validates :daily_report, presence: true
  validates :staff_type, presence: true
  validates :overhead_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :rotaed_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :actual_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
