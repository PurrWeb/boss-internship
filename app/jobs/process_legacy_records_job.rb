class ProcessLegacyRecordsJob < ActiveJob::Base
  def perform
    record_slice_size = 50

    next_hours_acceptance_periods_for_process = HoursAcceptancePeriod.accepted.where(
      processed_for_legacy_validation_at: nil,
      legacy_validation_process_issue: nil,
    ).limit(record_slice_size)
    ProcessLegacyHoursAcceptancePeriods.new.call(
      hours_acceptance_periods_relation: next_hours_acceptance_periods_for_process
    )

    next_holidays_for_process = Holiday.in_state(:enabled).where(
      processed_for_legacy_validation_at: nil,
      legacy_validation_process_issue: nil,
    ).limit(record_slice_size)
    ProcessLegacyHolidays.new.call(
      holidays_relation: next_holidays_for_process
    )

    next_owed_hours_for_process = OwedHour.enabled.where(
      processed_for_legacy_validation_at: nil,
      legacy_validation_process_issue: nil,
    ).limit(record_slice_size)
    ProcessLegacyOwedHours.new.call(
      owed_hours_relation: next_owed_hours_for_process
    )
  end
end
