class DailyReport < ActiveRecord::Base
  belongs_to :venue

  validates :venue, presence: true
  validates :date, presence: true
  has_many :staff_member_sections, class_name: 'DailyReportStaffMemberSection', inverse_of: :daily_report

  validates :overheads_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :rotaed_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :actual_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def self.requiring_update
    where('last_update_requested_at != last_update_request_serviced')
  end

  def variance_cents
    if rotaed_cost_cents.present? && actual_cost_cents.present?
      rotaed_cost_cents - actual_cost_cents
    end
  end

  def pending_first_calculation?
    !last_calculated_at.present?
  end

  def update_required?
    last_update_requested_at != last_update_request_serviced
  end

  def self.mark_for_update!(venue:, date:)
    report = DailyReport.find_by(venue: venue, date: date)
    if report
      report.update_attributes!(
        last_update_requested_at: Time.current
      )
    else
      DailyReport.create!(
        venue: venue,
        date: date,
        overheads_cents: 0,
        rotaed_cost_cents: 0,
        actual_cost_cents: 0,
        last_update_requested_at: Time.current
      )
    end
  end
end
