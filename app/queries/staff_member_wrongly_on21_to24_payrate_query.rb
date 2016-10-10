class StaffMemberWronglyOn21To24PayrateQuery
  def initialize(now: Time.current)
    @now = now
  end

  def all
    StaffMember.
      enabled.
      joins(:pay_rate).
      merge(PayRate.is_21_to_24).
      where(
        "(date_of_birth >= ?) or (date_of_birth <= ?)",
        DateHelpers.years_before(
          time: now,
          years: 21
        ),
        DateHelpers.years_before(
          time: now,
          years: 25
        )
      )
  end

  private
  attr_reader :now
end
