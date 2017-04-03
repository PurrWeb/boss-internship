class AccruedHolidayEstimate
  def initialize(staff_member:, tax_year:)
    @staff_member = staff_member
    @tax_year = tax_year
  end
  attr_reader :staff_member, :tax_year

  def call
    accepted_hours = HoursAcceptancePeriod.
      joins(:clock_in_day).
      where(
        clock_in_days: {
          staff_member_id: staff_member.id,
        },
        starts_at: tax_year.rota_start_time..tax_year.rota_end_time,
        ends_at: tax_year.rota_start_time..tax_year.rota_end_time
      ).
      accepted.
      inject(0) do |sum, hours_acceptance_period|
        sum + hours_acceptance_period.payable_hours
      end

     (accepted_hours * scaling_factor).floor
  end

  def scaling_factor
    # This is as specified by client not sure what these numbers represent
    0.12 / 8
  end
end
