class RotaPDFTableData
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

  def initialize(week:, venue:)
    @venue = venue
    @week = week
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
      week_data.fetch(:sunday),
      'Total Hours'
    )
  end

  def data_rows
    rows = []

    staff_members.each do |staff_member|
      week_data = {
        total_hours: 0
      }

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
          week_data[:total_hours] += shifts.inject(0) { |sum, shift| sum + shift.total_hours }
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
        week_data.fetch(:sunday),
        week_data.fetch(:total_hours)
      )
    end

    rows
  end

  private
  attr_reader :venue, :week

  def rotas
    Rota.where(date: week.start_date..week.end_date)
  end

  def staff_members
    StaffMember.joins(:rota_shifts).merge(shifts).uniq
  end

  def shifts_lookup
    @shifts_lookup ||= ShiftLookup.new(shifts)
  end

  def shifts
    RotaShift.
      enabled.
      joins(:rota).
      merge(rotas)
  end
end
