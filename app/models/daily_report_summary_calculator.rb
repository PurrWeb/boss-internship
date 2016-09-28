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
      result[:rotaed_cost_minus_overheads_cents] += staff_member.rotaed_cost_cents.to_i
      result[:actual_cost_minus_overheads_cents] += staff_member.actual_cost_cents.to_i
    end

    overhead_staff_members = OverheadStaffMemberQuery.new(
      venue: venue,
      date: date
    ).all.
      includes(:pay_rate)
    result[:overheads_cents] = overhead_staff_members.map do |staff_member|
      staff_member.pay_rate.cents / 7.0
    end.sum.to_i

    result[:actual_cost_cents] = result.fetch(:overheads_cents) + result.fetch(:actual_cost_minus_overheads_cents)
    result[:variance_cents] = result.fetch(:rotaed_cost_minus_overheads_cents) - result.fetch(:actual_cost_minus_overheads_cents)

    result
  end
end
