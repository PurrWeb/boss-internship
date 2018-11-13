class ProcessLegacyHoursAcceptancePeriods < ActiveRecord::Migration
  def call(hours_acceptance_periods_relation:, now: Time.current)
    hours_acceptance_periods_relation.each do |hours_acceptance_period|
      if hours_acceptance_period.valid?
        hours_acceptance_period.update_attributes!(
          processed_for_legacy_validation_at: now,
        )
        next
      end

      no_finance_report_exists = false
      invalid_breaks_exist = false
      overlapping_accepted_hours_exist = false
      conflicting_holidays_exist = false
      conflicting_owed_hours_exist = false
      no_accepter_exists = false

      if hours_acceptance_period.errors["finance_report"].include?("can't be blank")
        no_finance_report_exists = true
      end
      if hours_acceptance_period.errors["accepted_by"].include?("can't be blank") && hours_acceptance_period.errors["accepted_at"].include?("can't be blank")
        no_accepter_exists = true
      end
      if hours_acceptance_period.errors[:base].include?(HoursAcceptancePeriodTimeOverlapValidator::OVERLAPPING_PERIOD_VALIDATION_MESSAGE)
        overlapping_accepted_hours_exist = true
      end
      if hours_acceptance_period.errors["hours_acceptance_breaks"].include?('is invalid')
        invalid_breaks_exist = true
      end
      if hours_acceptance_period.errors[:base].include?(HoursAcceptancePeriodTimeOverlapValidator::CONFLICTING_OWED_HOURS_VALIDATION_MESSAGE)
        conflicting_owed_hours_exist = true
      end
      if hours_acceptance_period.errors[:base].include?(HoursAcceptancePeriodTimeOverlapValidator::CONFLICTING_HOLIDAYS_VALIDATION_MESSAGE)
        conflicting_holidays_exist = true
      end

      if no_finance_report_exists || overlapping_accepted_hours_exist || conflicting_holidays_exist || conflicting_owed_hours_exist || no_accepter_exists || invalid_breaks_exist
        hours_acceptance_period.update_attributes!(
          allow_invalid_breaks: invalid_breaks_exist,
          allow_no_finance_report: no_finance_report_exists,
          allow_legacy_overlap_accepted_hours: overlapping_accepted_hours_exist,
          allow_legacy_conflicting_holiday: conflicting_holidays_exist,
          allow_legacy_conflicting_owed_hours: conflicting_owed_hours_exist,
          allow_no_accepter: no_accepter_exists,
          processed_for_legacy_validation_at: now,
        )
      else
        hours_acceptance_period.update_attribute(:legacy_validation_process_issue, true)
      end
    end
  end
end
