class NotOnHolidayValidator
  def initialize(rota_shift)
    @rota_shift = rota_shift
  end

  def validate
    if rota_shift.starts_at.present? && rota_shift.staff_member.present?
      rota_date = RotaShiftDate.to_rota_date(rota_shift.starts_at)

      staff_member_holidays = Holiday.
        in_state(:enabled).
        where(staff_member: rota_shift.staff_member)

      conflicting_holidays = HolidayInRangeQuery.new(
        relation: staff_member_holidays,
        start_date: rota_date,
        end_date: rota_date
      ).all

      if conflicting_holidays.present?
        rota_shift.errors.add(:base, 'Staff member is on holiday')
      end
    end
  end

  private
  attr_accessor :rota_shift
end
