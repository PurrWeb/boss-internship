class DailyReport < ActiveRecord::Base
  belongs_to :venue

  validates_inclusion_of :update_required, in: [true, false]
  validates :venue, presence: true
  validates :date, presence: true
  has_many :staff_member_sections, class_name: 'DailyReportStaffMemberSection', inverse_of: :daily_report

  validates :overheads_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :rotaed_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :actual_cost_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def self.requiring_update
    where(update_required: true)
  end

  def variance_cents
    if rotaed_cost_cents.present? && actual_cost_cents.present?
      rotaed_cost_cents - actual_cost_cents
    end
  end

  def pending_first_calculation?
    !last_calculated_at.present?
  end

  def self.mark_for_update!(venue:, date:)
    report = DailyReport.find_by(venue: venue, date: date)
    if report
      report.update_attributes(update_required: true)
    else
      DailyReport.create!(
        venue: venue,
        date: date,
        overheads_cents: 0,
        rotaed_cost_cents: 0,
        actual_cost_cents: 0,
        update_required: true
      )
    end
  end
end
