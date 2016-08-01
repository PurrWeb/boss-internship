class StaffMemberWronglyOn21To25PayrateQuery
  def all
    StaffMember.
      enabled.
      joins(:pay_rate).
      merge(PayRate.is_21_to_25).
      where(
        "(date_of_birth >= ?) OR (date_of_birth <= ?)",
        DateHelpers.years_before(
          time: Time.current,
          years: 20
        ),
        DateHelpers.years_before(
          time: Time.current,
          years: 25
        )
      )
  end
end
