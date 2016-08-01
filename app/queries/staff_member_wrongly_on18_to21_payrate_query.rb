class StaffMemberWronglyOn18To21PayrateQuery
  def all
    StaffMember.
      enabled.
      joins(:pay_rate).
      merge(PayRate.is_18_to_21).
      where(
        "(date_of_birth >= ?) OR (date_of_birth <= ?)",
        DateHelpers.years_before(
          time: Time.current,
          years: 17
        ),
        DateHelpers.years_before(
          time: Time.current,
          years: 21
        )
      )
  end
end
