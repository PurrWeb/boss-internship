class HourlyStaffCost
  def initialize(staff_members:, rota:)
    @staff_members = staff_members.includes(:pay_rate)
    @rota = rota
  end

  def total_cents
    if staff_members.present?
      staff_members.map do |staff_member|
        hours_rotaed = rota_shifts(staff_member).inject(0) do |sum, shift|
          sum + shift.total_hours
        end

        if hours_rotaed == 0 || staff_member.pay_rate.weekly?
          0
        elsif staff_member.pay_rate.hourly?
          hours_rotaed * staff_member.pay_rate.cents
        else
          raise 'unsupported payrate type'
        end
      end.sum
    else
      0
    end
  end

  private
  attr_reader :staff_members, :rota

  def rota_shifts(staff_member)
    rota.rota_shifts.enabled.where(staff_member: staff_member)
  end
end
