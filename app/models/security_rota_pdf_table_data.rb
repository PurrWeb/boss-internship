class SecurityRotaPDFTableData
  Row = Struct.new(
    :name,
    :monday,
    :tuesday,
    :wednesday,
    :thursday,
    :friday,
    :saturday,
    :sunday
  )

  def initialize(date)
    @week = RotaWeek.new(date)
  end

  def header_row
    week_data = {}
    week.each_with_day do |date, day|
      week_data[day] = date.to_s(:human_date)
    end

    Row.new(
      'Name',
      week_data.fetch(:monday),
      week_data.fetch(:tuesday),
      week_data.fetch(:wednesday),
      week_data.fetch(:thursday),
      week_data.fetch(:friday),
      week_data.fetch(:saturday),
      week_data.fetch(:sunday)
    )
  end

  def data_rows
    rows = []

    staff_member_with_shifts_in_week.each do |staff_member|
      week_data = {}
      week.each_with_day do |date, day|
        staff_member_shifts = shifts_on_day_for_staff_member(staff_member: staff_member, date: date)

        if staff_member_shifts.present?
          times = staff_member_shifts.sort(&:starts_at).map do |shift|
            "(#{shift.venue.name}) #{shift.starts_at.to_s(:human_time_no_date)} - #{shift.ends_at.to_s(:human_time_no_date)}"
          end

          week_data[day] = times.join(',\n')
        else
          week_data[day] = ''
        end
      end

      rows << Row.new(
        staff_member.full_name,
        week_data.fetch(:monday),
        week_data.fetch(:tuesday),
        week_data.fetch(:wednesday),
        week_data.fetch(:thursday),
        week_data.fetch(:friday),
        week_data.fetch(:saturday),
        week_data.fetch(:sunday)
      )
    end

    rows
  end

  private
  attr_reader :week

  def security_staff_members
    StaffMember.enabled.security
  end

  def staff_member_with_shifts_in_week
    security_staff_members.
      joins(:rota_shifts).
      merge(
        shifts_in_week(week)
      )
  end

  def shifts_in_week(week)
    RotaShift.
      enabled.
      joins(:rota).
      merge(
        Rota.where(date: week.start_date..week.end_date)
      )
  end

  def shifts_on_day_for_staff_member(staff_member:, date:)
    RotaShift.
      enabled.
      joins(:rota).
      merge(
        Rota.where(date: date)
      ).
      where(staff_member: staff_member)
  end
end
