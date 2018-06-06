class StaffMemberPaymentsIndexQuery
  def initialize(staff_member:, start_date:, end_date:, status_filter:, now: Time.current, relation: Payment)
    @staff_member = staff_member
    @now = now
    @start_date = start_date
    @end_date = end_date
    @status_filter = status_filter
    @relation = relation
  end
  attr_reader :staff_member, :now, :start_date, :end_date, :status_filter, :relation

  def all
    result = relation.enabled.where(staff_member: staff_member)
    result = InRangeQuery.new(
      relation: result,
      start_value: start_date,
      end_value: end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    if status_filter == StaffMemberPaymentPageFilter::UNCOLLECTED_ONLY_STATUS_FILTER_VALUE
      result = result.not_in_state(:received)
    elsif status_filter == StaffMemberPaymentPageFilter::LATE_ONLY_STATUS_FILTER_VALUE
      result = result.not_in_state(:received).where('`date` < ?', late_payment_deadline)
    end

    result
  end

  def late_payment_deadline
    now - 2.weeks
  end
end
