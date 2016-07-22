class OverheadStaffCost
  def initialize(rota:)
    @rota = rota
    @week = RotaWeek.new(rota.date)
  end
  attr_reader :rota, :week

  def total_cents
    staff_members = StaffMember.
      enabled.
      where(master_venue: rota.venue).
      where('`staff_members`.created_at < ?', week.start_date).
      joins(:pay_rate).
      merge(PayRate.weekly).
      includes(:pay_rate)

    staff_members.map do |staff_member|
      staff_member.pay_rate.cents / 7.0
    end.sum
  end
end
