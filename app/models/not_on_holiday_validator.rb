class NotOnHolidayValidator
  def initialize(record)
    @record = record
  end

  def validate
    rota_date = RotaShiftDate.to_rota_date(record.starts_at)

    conflicting_holidays = HolidayInRangeQuery.new(
      relation: Holiday.in_state(:enabled),
      start_date: rota_date,
      end_date: rota_date
    ).all

    if conflicting_holidays.present?
      record.errors.add(:base, 'Staff member is on holiday')
    end
  end

  private
  attr_accessor :record
end
