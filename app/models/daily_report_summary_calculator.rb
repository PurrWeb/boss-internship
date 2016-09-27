class DailyReportSummaryCalculator
  def initialize(date:, venue:)
    @date = date
    @venue = venue
    @staff_members = DailyReportsIndexStaffMemberQuery.new(date: date, venue: venue).all
    ActiveRecord::Associations::Preloader.new.preload(staff_members, [:name, :staff_type])
  end

  attr_reader :date, :venue, :staff_members

  def calculate
    result = {
      overheads_cents: 0,
      rotaed_cost_minus_overheads_cents: 0,
      actual_cost_minus_overheads_cents: 0,
      actual_cost_cents: 0
    }

    staff_members.each do |staff_member|
      result[:overheads_cents] += staff_member.overhead_cost_cents.to_i
      result[:rotaed_cost_minus_overheads_cents] += staff_member.rotaed_cost_cents.to_i
      result[:actual_cost_minus_overheads_cents] += staff_member.actual_cost_cents.to_i
    end
    result[:actual_cost_cents] = result.fetch(:overheads_cents) + result.fetch(:actual_cost_minus_overheads_cents)
    result[:variance_cents] = result.fetch(:rotaed_cost_minus_overheads_cents) - result.fetch(:actual_cost_minus_overheads_cents)

    result
  end
end
