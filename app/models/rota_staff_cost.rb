class RotaStaffCost
  def initialize(staff_members:, rota:)
    @staff_members = staff_members
    @rota = rota
  end

  def total
    if shifts.present?
      shifts.map do |rota_shift|
        rota_shift.total_hours * Money.from_amount(rota_shift.staff_member.pay_rate.pounds_per_hour)
      end.sum
    else
      Money.new(0)
    end
  end

  private
  attr_reader :staff_members, :rota

  def shifts
    rota.rota_shifts.enabled.where(staff_member: staff_members)
  end
end
