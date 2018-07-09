class OwedHourView
  def initialize(owed_hour:)
    raise "Model class name should be `OwedHour`" unless owed_hour.class.name == "OwedHour"
    @owed_hour = owed_hour
  end

  attr_reader :owed_hour

  def serialize
    hours_helper = HoursHelper.new(total_minutes: owed_hour.minutes)
    {
      id: owed_hour.id,
      date: UIRotaDate.format(owed_hour.date),
      times: {
        startsAtOffset: owed_hour.starts_at && ((owed_hour.starts_at - RotaShiftDate.new(owed_hour.date).start_time) / 60).floor,
        endsAtOffset: owed_hour.ends_at && ((owed_hour.ends_at - RotaShiftDate.new(owed_hour.date).start_time) / 60).floor,
        startsAt: owed_hour.starts_at.andand.iso8601,
        endsAt: owed_hour.ends_at.andand.iso8601
      },
      duration: {
        hours: hours_helper.hours,
        minutes: hours_helper.minutes,
      },
      createdBy: owed_hour.creator.full_name,
      createdAt: owed_hour.created_at.iso8601,
      note: owed_hour.note,
      editable: owed_hour.editable?,
      hasDate: owed_hour.has_times?,
      payslipDate: UIRotaDate.format(owed_hour.payslip_date)
    }
  end
end
