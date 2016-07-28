class StaffMembersWithoutNINumberQuery
  def all
    staff_members_table = Arel::Table.new(:staff_members)
    staff_member_transitions = Arel::Table.new(:staff_member_transitions)
    most_recent_staff_member_transitions = staff_member_transitions.alias('most_recent_staff_member_transition')

    query = staff_members_table.
      join(most_recent_staff_member_transitions, Arel::Nodes::OuterJoin).
      on(
        staff_members_table[:id].eq(
          most_recent_staff_member_transitions[:staff_member_id]
        ).
        and(
          most_recent_staff_member_transitions[:most_recent].eq(1)
        )
      ).
      where(
        most_recent_staff_member_transitions[:to_state].eq(nil).
        or(
          most_recent_staff_member_transitions[:to_state].eq("enabled")
        )
      ).
      where(
        staff_members_table[:national_insurance_number].eq(nil).
        or(
          Arel.sql("`staff_members`.`national_insurance_number` REGEXP '^[[:blank:]]+$'")
        )
      ).
      project(staff_members_table[Arel.star])

    StaffMember.find_by_sql(query)
  end
end
