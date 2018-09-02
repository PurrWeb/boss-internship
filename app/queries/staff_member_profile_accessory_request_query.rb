class StaffMemberProfileAccessoryRequestQuery
  def initialize(staff_member:, filter_params:)
    @staff_member = staff_member
    @filter_params = filter_params
  end
  attr_reader :staff_member, :filter_params

  def all
    accessory_requests = AccessoryRequest.arel_table
    query = AccessoryRequest.where(
      accessory_requests.grouping(
        accessory_requests[:staff_member_id].eq(staff_member.id).
        and(
          accessory_requests[:payslip_date].eq(nil)
        )
      ).or(
        accessory_requests.grouping(
          accessory_requests[:staff_member_id].eq(staff_member.id)
          .and(
            accessory_requests[:payslip_date].lteq(filter_params.fetch(:payslip_end_date)).
            and(
              accessory_requests[:payslip_date].gteq(filter_params.fetch(:payslip_start_date))
            )
          )

        )
      )
    )

    query.all
  end
end
