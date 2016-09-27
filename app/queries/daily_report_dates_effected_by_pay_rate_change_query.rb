class DailyReportDatesEffectedByPayRateChangeQuery
  def initialize(pay_rate:, now: Time.current)
    @pay_rate = pay_rate
    @now = now
  end
  attr_reader :pay_rate, :now

  def to_a
    rotas_arel = Arel::Table.new(:rotas)
    clock_in_days_arel = Arel::Table.new(:clock_in_days)

    current_week = RotaWeek.new(RotaShiftDate.to_rota_date(now))

    effected_staff_members = StaffMember.enabled.where(pay_rate: pay_rate)

    effected_shift_data = Rota.
      joins(:rota_shifts).
      merge(
        RotaShift.
          joins(:staff_member).
          merge(effected_staff_members)
      ).
      where(
        rotas_arel[:date].gteq(current_week.start_date)
      ).
      includes(:venue).
      map do |rota|
        [rota.date, rota.venue]
      end

    effected_acceptance_data = ClockInDay.
      joins(:staff_member).
      merge(effected_staff_members).
      joins(:hours_acceptance_periods).
      merge(HoursAcceptancePeriod.enabled).
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
