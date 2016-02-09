class NotOnHolidayValidator
  def initialize(record)
    @record = record
  end

  def validate
    rota_date = RotaShiftDate.to_rota_date(record.starts_at)

    conflicting_holidays = InRangeQuery.new(
      relation: Holiday.all,
      start_value: rota_date,
      end_value: rota_date,
      start_column_name: "start_date",
      end_column_name: "end_date"
    ).all

    if conflicting_holidays.present?
      record.errors.add(:base, 'Staff member is on holiday')
    end
  end

  private
  attr_accessor :record
end
