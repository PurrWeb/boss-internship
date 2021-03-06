class ProcessLegacyHolidays < ActiveRecord::Migration
  def call(holidays_relation:, now: Time.current)
    holidays_relation.each do |holiday|
      if holiday.valid?
        holiday.update_attributes!(
          processed_for_legacy_validation_at: now,
        )
        next
      end

      no_finance_report_exists = false
      conflicting_rota_shift_exists = false
      overlap_accepted_hours_exists = false
      conflicting_holiday_exists = false
      conflicting_holiday_request_exists = false
      conflicting_owed_hours_exists = false

      if holiday.errors["finance_report"].include?("can't be blank")
        no_finance_report_exists = true
      end
      if holiday.errors["base"].include?(HolidayDateValidator::CONFLICTING_HOLIDAY_VALIDATION_MESSAGE)
        conflicting_holiday_exists = true
      end
      if holiday.errors["base"].include?(HolidayDateValidator::CONFLICTING_HOLIDAY_REQUEST_VALIDATION_MESSAGE)
        conflicting_holiday_request_exists = true
      end
      if holiday.errors["base"].include?(HolidayDateValidator::CONFLICTING_ROTA_SHIFT_VALIDATION_MESSAGE)
        conflicting_rota_shift_exists = true
      end
      if holiday.errors["base"].include?(HolidayDateValidator::CONFLICTING_OWED_HOURS_VALIDATION_MESSAGE)
        conflicting_owed_hours_exists = true
      end
      if holiday.errors["base"].include?(HolidayDateValidator::CONFLICTING_HOURS_VALIDATION_MESSAGE)
        overlap_accepted_hours_exists = true
      end

      update_successful = false
      if no_finance_report_exists || conflicting_rota_shift_exists || overlap_accepted_hours_exists || conflicting_holiday_exists || conflicting_holiday_request_exists || conflicting_owed_hours_exists
        update_successful = holiday.update_attributes(
          allow_no_finance_report: no_finance_report_exists,
          allow_legacy_conflicting_rota_shift: conflicting_rota_shift_exists,
          allow_legacy_overlap_accepted_hours: overlap_accepted_hours_exists,
          allow_legacy_conflicting_holiday: conflicting_holiday_exists,
          allow_legacy_conflicting_holiday_request: conflicting_holiday_request_exists,
          allow_legacy_conflicting_owed_hours: conflicting_owed_hours_exists,
          processed_for_legacy_validation_at: now,
        )
      end

      if !update_successful
        holiday.update_attribute(:legacy_validation_process_issue, true)
      end
    end
  end
end
