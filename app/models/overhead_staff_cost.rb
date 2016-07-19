class OverheadStaffCost
  def initialize(rota:)
    @rota = rota
    @week = RotaWeek.new(rota.date)
  end
  attr_reader :rota, :week

  def total
    staff_members = StaffMember.
      enabled.
      where(master_venue: rota.venue).
      where('`staff_members`.created_at < ?', week.start_date).
      joins(:pay_rate).
      merge(PayRate.weekly).
      includes(:pay_rate)

    staff_members.map do |staff_member|
      Money.from_amount(staff_member.pay_rate.rate_in_pounds / 7.0)
    end.sum(Money.new(0))
  end
end
