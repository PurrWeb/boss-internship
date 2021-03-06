class StaffMemberWronglyOn25PlusPayrateQuery
  def initialize(now: Time.current)
    @now = now
  end

  def all
    StaffMember.
      enabled.
      joins(:pay_rate).
      merge(PayRate.is_25_plus).
      where(
        "date_of_birth > ?",
        DateHelpers.years_before(
          time: now,
          years: 25
        )
      )
  end

  private
  attr_reader :now
end
