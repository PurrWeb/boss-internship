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
      '',
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

    staff_members.group_by(&:staff_type).each_with_index do |(staff_type, grouped_staff_members), index|
      rows << Row.new('', '', '', '', '', '', '', '', '') unless index == 0

      rows << Row.new("<b>#{staff_type.name}</b>", '', '', '', '', '', '', '', '')

      grouped_staff_members.each do |staff_member|
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
              standby_signifier = shift.standby? ? " (SB)" : ""
              "#{shift.starts_at.to_s(:human_time_no_date)} - #{shift.ends_at.to_s(:human_time_no_date)}#{ standby_signifier }"
            end

            week_data[day] = times.join(",\n")
            week_data[:total_hours] += shifts.inject(0) { |sum, shift| sum + shift.total_hours }
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
