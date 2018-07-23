class StaffMemberProfileOwedHourIndexQuery
  def initialize(staff_member:, start_date:, end_date:, payslip_start_date:, payslip_end_date:)
    @staff_member = staff_member
    @start_date = start_date
    @end_date = end_date
    @payslip_start_date = payslip_start_date
    @payslip_end_date = payslip_end_date
  end
  attr_reader :staff_member, :start_date, :end_date, :payslip_start_date, :payslip_end_date

  def all
    owed_hours = OwedHour.enabled.
      where(staff_member: staff_member)

    if filtering_by_date?
      owed_hours = InRangeQuery.new(
        relation: owed_hours,
        start_value: start_date,
        end_value: end_date,
        start_column_name: 'date',
        end_column_name: 'date'
      ).all
    end

    if filtering_by_payslip_date?
      owed_hours = InRangeQuery.new(
        relation: owed_hours,
        start_value: payslip_start_date,
        end_value: payslip_end_date,
        start_column_name: 'payslip_date',
        end_column_name: 'payslip_date'
      ).all
    end

    owed_hours
  end

  def filtering_by_date?
    start_date.present? && end_date.present?
  end

  def filtering_by_payslip_date?
    payslip_start_date.present? && payslip_end_date.present?
  end
end
