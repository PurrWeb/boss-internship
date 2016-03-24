class SecurityRotaPDFTableData
  Row = Struct.new(
    :name,
    :monday,
    :tuesday,
    :wednesday,
    :thursday,
    :friday,
    :saturday,
    :sunday,
    :total_hours
  )

  def initialize(week)
    @week = week
  end

  def header_row
    week_data = {}
    week.each_with_day do |date, day|
      week_data[day] = date.to_s(:human_date)
    end

    Row.new(
      '<b>Name</b>',
      "<b>#{ week_data.fetch(:monday)    }</b>",
      "<b>#{ week_data.fetch(:tuesday)   }</b>",
      "<b>#{ week_data.fetch(:wednesday) }</b>",
      "<b>#{ week_data.fetch(:thursday)  }</b>",
      "<b>#{ week_data.fetch(:friday)    }</b>",
      "<b>#{ week_data.fetch(:saturday)  }</b>",
      "<b>#{ week_data.fetch(:sunday)    }</b>",
      '<b>Total Hours</b>'
    )
  end

  def data_rows
    rows = []

    staff_member_with_shifts_in_week.each do |staff_member|
      week_data = {
        total_hours: 0
      }

      week.each_with_day do |date, day|
        staff_member_shifts = shifts_on_day_for_staff_member(staff_member: staff_member, date: date)

        if staff_member_shifts.present?
          times = staff_member_shifts.sort_by(&:starts_at).map do |shift|
            "(#{shift.venue.name}) #{shift.starts_at.to_s(:human_time_no_date)} - #{shift.ends_at.to_s(:human_time_no_date)}"
          end

          week_data[day] = times.join(",\n")
          week_data[:total_hours] += staff_member_shifts.inject(0) do |sum, shift|
            sum + shift.total_hours
          end
        else
          week_data[day] = ''
        end
      end

      rows << Row.new(
        staff_member.full_name.titlecase,
        week_data.fetch(:monday),
        week_data.fetch(:tuesday),
        week_data.fetch(:wednesday),
        week_data.fetch(:thursday),
        week_data.fetch(:friday),
        week_data.fetch(:saturday),
        week_data.fetch(:sunday),
        week_data.fetch(:total_hours)
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
      ).uniq
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
