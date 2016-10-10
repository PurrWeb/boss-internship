class StaffMemberWronglyOn18To20PayrateQuery
  def initialize(now: Time.current)
    @now = now
  end

  def all
    StaffMember.
      enabled.
      joins(:pay_rate).
      merge(PayRate.is_18_to_20).
      where(
        "(date_of_birth > ?) OR (date_of_birth < ?)",
        DateHelpers.years_before(
          time: now,
          years: 18
        ),
        DateHelpers.years_before(
          time: now,
          years: 21
        )
      )
  end

  private
  attr_reader :now
end
