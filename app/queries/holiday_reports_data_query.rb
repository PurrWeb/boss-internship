class HolidayReportsDataQuery
  def initialize(week:, venue:)
    @week = week
    @venue = venue
  end

  def holidays
    @holidays ||= begin
      HolidayInRangeQuery.new(
        relation: relation,
        start_date: week.start_date,
        end_date: week.end_date
      ).all
    end
  end

  def holidays_on_weekday(weekday: nil)
    unless weekday.present?
      return holidays
    end
    day = week.start_date + (weekday.to_i - 1).days
    HolidayInRangeQuery.new(
      relation: relation,
      start_date: day,
      end_date: day,
    ).all
  end

  def holidays_count
    holidays_count = {}
    holidays.each do |holiday|
      start_date_weekday = holiday.start_date.cwday
      end_date_weekday = holiday.end_date.cwday
      
      (start_date_weekday..end_date_weekday).each do |i|
        unless holidays_count[i].present?
          holidays_count[i] = 0
        end
        holidays_count[i] = holidays_count[i] + 1
      end
    end
    holidays_count
  end

  def staff_members
    StaffMember.
      joins(:holidays).
      merge(holidays)
  end

  attr_reader :week, :venue

  private
  def relation
    relation = Holiday.
      in_state(:enabled)

    if venue.present?
      relation = relation.
        joins(:staff_member).
        merge(
          StaffMember.
            where(master_venue: venue)
        )
    end
    relation
  end
end
