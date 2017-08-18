class OwedHourView
  def initialize(owed_hour:)
    raise "Model class name should be `OwedHour`" unless owed_hour.class.name == "OwedHour"
    @owed_hour = owed_hour
  end

  attr_reader :owed_hour
  
  def serialize
    hours_helper = HoursHelper.new(total_minutes: owed_hour.minutes)
    serialized_owed_hour = {
      id: owed_hour.id,
      date: owed_hour.date,
      times: {
        startsAt: owed_hour.starts_at,
        endsAt: owed_hour.ends_at
      },
      duration: {
        hours: hours_helper.hours,
        minutes: hours_helper.minutes,
      },
      createdBy: owed_hour.creator.full_name,
      createdAt: owed_hour.created_at,
      note: owed_hour.note,
      editable: owed_hour.editable?,
      hasDate: owed_hour.has_times?
    }
  end
end
