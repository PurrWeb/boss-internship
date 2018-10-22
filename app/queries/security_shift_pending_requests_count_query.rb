class SecurityShiftPendingRequestsCountQuery
  def initialize(week:)
    @week = week
  end

  def all
    week_start_time = RotaShiftDate.new(week.start_date).start_time
    week_end_time = RotaShiftDate.new(week.end_date).end_time

    week_security_shift_requests = SecurityShiftRequest
      .pending
      .where(starts_at: week_start_time..week_end_time)
    result = (week.start_date..week.end_date).inject({}) do |acc, day|
      acc[UIRotaDate.format(day)] = 0
      acc
    end
    week_security_shift_requests.each do |security_shift_request|
      ui_date = UIRotaDate.format(RotaShiftDate.to_rota_date(security_shift_request.starts_at))
      result[ui_date] ||= 0
      result[ui_date] += 1
    end
    result
  end

  private
  attr_reader :week
end
