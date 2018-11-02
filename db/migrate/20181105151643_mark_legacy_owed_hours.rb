class MarkLegacyOwedHours < ActiveRecord::Migration
  def change
    OwedHour.includes.find_each do |owed_hour|
      next if owed_hour.valid?

      no_finance_report_exists = false
      overlapping_accepted_hours_exist = false
      conflicting_holiday_exist = false
      conflicting_owed_hours_exist = false
      conflicting_holiday_request_exist = false


      if owed_hour.errors["finance_report"].include?("can't be blank")
        no_finance_report_exists = true
      end
      if owed_hour.errors["base"].include?(OwedHour::CONFLICTING_HAP_PERIOD_VALIDATION_MESSAGE)
        overlapping_accepted_hours_exist = true
      end

      if owed_hour.errors["base"].include?(OwedHour::CONFLICTING_HOLIDAY_REQUESTS_VALIDATION_MESSAGE)
        conflicting_holiday_request_exist = true
      end

      if owed_hour.errors["base"].include?(OwedHour::CONFLICTING_HOLIDAYS_VALIDATION_MESSAGE)
        conflicting_holiday_exist = true
      end

      if owed_hour.errors["base"].include?(OwedHour::CONFLICTING_OWED_HOURS_VALIDATION_MESSAGE)
        conflicting_owed_hours_exist = true
      end

      if no_finance_report_exists || overlapping_accepted_hours_exist || conflicting_holiday_exist || conflicting_owed_hours_exist || conflicting_holiday_request_exist
        owed_hour.update_attributes!(
          allow_no_finance_report: no_finance_report_exists,
          allow_legacy_overlap_accepted_hours: overlapping_accepted_hours_exist,
          allow_legacy_conflicting_holiday: conflicting_holiday_exist,
          allow_legacy_conflicting_owed_hours: conflicting_owed_hours_exist,
          allow_legacy_conflicting_holiday_request: conflicting_holiday_request_exist,
        )
      else
        raise "Couldn't process #{owed_hour.errors.to_a}"
      end
    end
  end
end
