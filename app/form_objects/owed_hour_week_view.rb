class OwedHourWeekView
  def initialize(owed_hours:)
    raise "Models class name should be `ActiveRecord::Relation`" unless owed_hours.class.name == "ActiveRecord::Relation"
    if owed_hours.present?
      raise "Model class name should be `OwedHour`" unless owed_hours.first.class.name == "OwedHour"
    end
    @owed_hours = owed_hours
  end

  attr_reader :owed_hours

  def serialize
    owed_hours_by_week = owed_hours.
      group_by { |owed_hour| RotaWeek.new(owed_hour.date) }.sort do |a, b|
        b.first <=> a.first
      end
    owed_hours_by_week.map do |week, owed_hours|
      total_minutes = owed_hours.inject(0) { |sum, owed_hours| sum + owed_hours.minutes }
      {
        week: {
          startDate: UIRotaDate.format(week.start_date),
          endDate: UIRotaDate.format(week.end_date),
          totalHours: HoursHelper.new(total_minutes: total_minutes).description
        },
        owedHours: owed_hours.map do |owed_hour|
          OwedHourView.new(owed_hour: owed_hour).serialize
        end
      }
    end
  end
end
