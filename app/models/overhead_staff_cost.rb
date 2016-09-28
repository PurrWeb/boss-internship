class OverheadStaffCost
  def initialize(venue:, date:)
    @venue = venue
    @date = date
  end
  attr_reader :venue, :date

  def total_cents
    staff_members = OverheadStaffMemberQuery.new(
      venue: venue,
      date: date
    ).all.
      includes(:pay_rate)

    staff_members.map do |staff_member|
      staff_member.pay_rate.cents / 7.0
    end.sum
  end
end
