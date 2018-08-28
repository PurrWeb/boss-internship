class StaffMemberProfileAccessoryRequestQuery
  def initialize(staff_member:, filter_params:)
    @staff_member = staff_member
    @filter_params = filter_params
  end
  attr_reader :staff_member, :filter_params

  def all
    InRangeQuery.new({
      relation: staff_member.accessory_requests,
      start_value: filter_params.fetch(:payslip_start_date),
      end_value: filter_params.fetch(:payslip_end_date),
      start_column_name: 'payslip_date',
      end_column_name: 'payslip_date'
    }).all
  end
end
