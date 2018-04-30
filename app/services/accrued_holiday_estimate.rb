class AccruedHolidayEstimate
  def initialize(staff_member:, tax_year:)
    @staff_member = staff_member
    @tax_year = tax_year
    @staff_member_start_date = staff_member.starts_at
  end
  attr_reader :staff_member, :tax_year, :staff_member_start_date

  def call
    start_date = [tax_year.start_date, staff_member_start_date].max
    start_time = RotaShiftDate.new(start_date).start_time
    end_time = tax_year.rota_end_time

    accepted_hours = HoursAcceptancePeriod.
      joins(:clock_in_day).
      where(
        clock_in_days: {
          staff_member_id: staff_member.id,
        },
        starts_at: start_time..end_time,
        ends_at: start_time..end_time
      ).
      accepted.
      includes(:hours_acceptance_breaks_enabled).
      inject(0) do |sum, hours_acceptance_period|
        sum + hours_acceptance_period.payable_hours
      end

      owed_hour_records = InRangeQuery.new(
        relation: OwedHour.enabled.where(staff_member: staff_member),
        start_value: start_time,
        end_value: end_time,
        start_column_name: 'created_at',
        end_column_name: 'created_at',
        include_boundaries: [:start]
      ).all

      owed_hours = owed_hour_records.inject(0) do |sum, owed_hour|
        sum + (owed_hour.minutes / 60.0)
      end

      total_hours = accepted_hours + owed_hours

     [(total_hours * scaling_factor).floor, 28].min
  end

  def scaling_factor
    # 12% is the number of hours accrued then we convert to days
    # based on an 8 hours shift
    0.12 / 8
  end
end
