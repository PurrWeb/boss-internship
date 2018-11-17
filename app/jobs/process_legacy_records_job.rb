class ProcessLegacyRecordsJob < ActiveJob::Base
  def perform
    record_slice_size = 50

    next_hours_acceptance_periods_for_process = HoursAcceptancePeriod.
      enabled.
      accepted.
      where(
        processed_for_legacy_validation_at: nil,
        legacy_validation_process_issue: nil,
      ).
      includes([
        :hours_acceptance_breaks,
        :finance_report,
        clock_in_day: [
          staff_member: [
            :owed_hours,
            holidays: [:holiday_transitions],
          ]
        ]
      ]).
      limit(record_slice_size)
    ProcessLegacyHoursAcceptancePeriods.new.call(
      hours_acceptance_periods_relation: next_hours_acceptance_periods_for_process
    )

    next_holidays_for_process = Holiday.in_state(:enabled).where(
      processed_for_legacy_validation_at: nil,
      legacy_validation_process_issue: nil,
    ).
      includes([
        :holiday_transitions,
        finance_report: [:finance_report_transitions],
        staff_member: [
          :staff_type,
          :rota_shifts,
          :hours_acceptance_periods,
          :owed_hours,
          holiday_requests: [:holiday_request_transitions],
          holidays: [:holiday_transitions],
        ],
      ]).
      limit(record_slice_size)
    ProcessLegacyHolidays.new.call(
      holidays_relation: next_holidays_for_process
    )

    next_owed_hours_for_process = OwedHour.enabled.where(
      processed_for_legacy_validation_at: nil,
      legacy_validation_process_issue: nil,
    ).
      includes([finance_report: [:finance_report_transitions], staff_member: [:staff_type, :holidays, :holiday_requests]]).
      limit(record_slice_size)
    ProcessLegacyOwedHours.new.call(
      owed_hours_relation: next_owed_hours_for_process
    )

    nil
  end
end
