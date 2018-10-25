class OwedHourApiErrors
  def initialize(owed_hour:)
    @owed_hour = owed_hour
  end

  attr_reader :owed_hour

  def errors
    result = {}
    result[:base] = owed_hour.errors[:base] if owed_hour.errors[:base].present?
    result[:date] = owed_hour.errors[:date] if owed_hour.errors[:date].present?
    result[:payslipDate] = owed_hour.errors[:payslip_date] if owed_hour.errors[:payslip_date].present?
    result[:startsAt] = owed_hour.errors[:starts_at] if owed_hour.errors[:starts_at].present?
    result[:endsAt] = owed_hour.errors[:ends_at] if owed_hour.errors[:ends_at].present?
    result[:note] = owed_hour.errors[:note] if owed_hour.errors[:note].present?
    result
  end
end
