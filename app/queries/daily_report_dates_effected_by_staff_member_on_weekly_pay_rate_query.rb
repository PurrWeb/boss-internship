class DailyReportDatesEffectedByStaffMemberOnWeeklyPayRateQuery
  def initialize(staff_member:, now: Time.current)
    @staff_member = staff_member
    @now = now
  end
  attr_reader :staff_member, :now

  def to_a
    rotas_arel = Arel::Table.new(:rotas)
    current_week = RotaWeek.new(RotaShiftDate.to_rota_date(now))

    rotas = Rota.
      where(
        rotas_arel[:date].gteq(current_week.start_date)
      ).where(
        venue: staff_member.master_venue
      )

    rotas.map do |rota|
      [rota.date, rota.venue]
    end
  end
end
