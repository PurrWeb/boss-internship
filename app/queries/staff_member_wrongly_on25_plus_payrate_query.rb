class StaffMemberWronglyOn25PlusPayrateQuery
  def all
    StaffMember.
      enabled.
      joins(:pay_rate).
      merge(PayRate.is_25_plus).
      where(
        "date_of_birth >= ?",
        DateHelpers.years_before(
          time: Time.current,
          years: 24
        )
      )
  end
end
