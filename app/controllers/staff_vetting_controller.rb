class StaffVettingController < ApplicationController
  def index
    authorize! :manage, :admin

    render locals: {
      staff_without_email: staff_without_email_query,
      staff_without_ni_number: staff_without_ni_number_query,
      staff_without_address: staff_without_address_query,
      staff_without_photo: staff_without_photo_query
    }
  end

  def staff_members_without_email
    render locals: { staff_without_email: staff_without_email_query }
  end

  def staff_members_without_ni_number
    render locals: { staff_without_ni_number: staff_without_ni_number_query }
  end

  def staff_members_without_address
    render locals: { staff_without_address: staff_without_address_query }
  end

  def staff_members_without_photo
    render locals: { staff_without_photo: staff_without_photo_query }
  end

  def staff_without_email_query
    StaffMember.
      enabled.
      where(email_address_id: nil).
      includes([:name, :master_venue])
  end

  def staff_without_ni_number_query
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

  def staff_without_address_query
    StaffMember.
      enabled.
      where(address_id: nil).
      includes([:name, :master_venue])
  end

  def staff_without_photo_query
    StaffMember.
      enabled.
      where(avatar: nil).
      includes([:name, :master_venue])
  end
end
