class DailyReportDatesEffectedByStaffMemberOnHourlyPayRateQuery
  def initialize(staff_member:, now: Time.current)
    @staff_member = staff_member
    @now = now
  end
  attr_reader :staff_member, :now

  def to_a
    rotas_arel = Arel::Table.new(:rotas)
    clock_in_days_arel = Arel::Table.new(:clock_in_days)

    current_week = RotaWeek.new(RotaShiftDate.to_rota_date(now))

    effected_shift_data = Rota.
      joins(:rota_shifts).
      merge(
        RotaShift.
          where(staff_member:  staff_member)
      ).
      where(
        rotas_arel[:date].gteq(current_week.start_date)
      ).
      includes(:venue).
      map do |rota|
        [rota.date, rota.venue]
      end

    effected_acceptance_data = ClockInDay.
      where(staff_member: staff_member).
      joins(:hours_acceptance_periods).
      merge(HoursAcceptancePeriod.enabled.accepted).
      where(
        clock_in_days_arel[:date].gteq(current_week.start_date)
      ).
      includes(:venue).
      map do |clock_in_day|
        [clock_in_day.date, clock_in_day.venue]
      end

    (effected_shift_data + effected_acceptance_data).uniq
  end
end
