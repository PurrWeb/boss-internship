class StaffMemberProfileHolidayIndexQuery
  def initialize(staff_member:, start_date:, end_date:, payslip_start_date:, payslip_end_date:)
    @staff_member = staff_member
    @start_date = start_date
    @end_date = end_date
    @payslip_start_date = payslip_start_date
    @payslip_end_date = payslip_end_date
  end
  attr_reader :staff_member, :start_date, :end_date, :payslip_start_date, :payslip_end_date

  def holidays
    filtered_holidays = staff_member.active_holidays
    if filtering_by_date?
      filtered_holidays = InRangeQuery.new(
          relation: filtered_holidays,
          start_value: start_date,
          end_value: end_date,
          start_column_name: 'start_date',
          end_column_name: 'end_date'
        ).all
    end
    if filtering_by_payslip_date?
      filtered_holidays = InRangeQuery.new(
        relation: filtered_holidays,
        start_value: payslip_start_date,
        end_value: payslip_end_date,
        start_column_name: 'payslip_date',
        end_column_name: 'payslip_date',

      ).all
    end
    filtered_holidays
  end

  def holiday_requests
    filtered_holiday_requests = nil
    if filtering_by_payslip_date?
      filtered_holiday_requests = HolidayRequest.none
    else
      filtered_holiday_requests = InRangeQuery.new(
        relation: staff_member.holiday_requests.in_state(:pending, :rejected),
        start_value: start_date,
        end_value: end_date,
        start_column_name: 'start_date',
        end_column_name: 'end_date'
      ).all
    end
    filtered_holiday_requests
  end

  def filtering_by_date?
    start_date.present? && end_date.present?
  end

  def filtering_by_payslip_date?
    payslip_start_date.present? && payslip_end_date.present?
  end
end
