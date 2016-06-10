class RotaStaffCost
  def initialize(staff_members:, rota:)
    @staff_members = staff_members
    @rota = rota
  end

  def total
    if staff_members.present?
      staff_members.map do |staff_member|
        hours_rotaed = rota_shifts(staff_member).inject(0) do |sum, shift|
          sum + shift.total_hours
        end

        if hours_rotaed == 0
          Money.new(0)
        elsif staff_member.pay_rate.hourly?
          hours_rotaed * Money.from_amount(staff_member.pay_rate.rate_in_pounds)
        elsif staff_member.pay_rate.weekly?
          hours_rotaed_in_week = weekly_shifts(staff_member).inject(0) do |sum, shift|
            sum + shift.total_hours
          end

          fraction_of_weekly_hours = (hours_rotaed / hours_rotaed_in_week)
          Money.from_amount(staff_member.pay_rate.rate_in_pounds * fraction_of_weekly_hours)
        else
          raise 'unsupported payrate type'
        end
      end.sum
    else
      Money.new(0)
    end
  end

  private
  attr_reader :staff_members, :rota

  def rota_shifts(staff_member)
    rota.rota_shifts.enabled.where(staff_member: staff_member)
  end

  def weekly_shifts(staff_member)
    week = RotaWeek.new(rota.date)

    rotas = InRangeQuery.new(
      relation: Rota.unscoped,
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    RotaShift.
      enabled.
      where(staff_member: staff_member).
      joins(:rota).
      merge(rotas)
  end
end
