class RotaPDFTableData
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

  def initialize(rota)
    @rota = rota
    @week = RotaWeek.new(rota.date)
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

    staff_members.each do |staff_member|
      week_data = {}
      week.each_with_day do |date, day|
        shifts = shifts_lookup.perform(
          staff_member: staff_member,
          date: date
        )

        if shifts.present?
          times = shifts.sort_by(&:starts_at).map do |shift|
            "#{shift.starts_at.to_s(:human_time_no_date)} - #{shift.ends_at.to_s(:human_time_no_date)}"
          end

          week_data[day] = times.join(",\n")
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
  attr_reader :rota, :week

  def staff_members
    StaffMember.joins(:rota_shifts).merge(shifts).uniq
  end

  def shifts_lookup
    @shifts_lookup ||= ShiftLookup.new(shifts)
  end

  def shifts
    RotaShift.enabled.where(rota: rota)
  end
end
