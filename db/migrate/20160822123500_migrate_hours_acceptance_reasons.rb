class HoursAcceptanceReason < ActiveRecord::Base; end
HoursAcceptancePeriod.class_eval do
  belongs_to :hours_acceptance_reason
end

class MigrateHoursAcceptanceReasons < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      processed_count = 0
      HoursAcceptancePeriod.find_each do |hours_acceptance_period|
        reason = hours_acceptance_period.hours_acceptance_reason
        if reason.present? && !special_reasons.include?(reason)
          hours_acceptance_period.update_attributes!(reason_note: reason.text)
        end

        processed_count += 1
        print "."
        $stdout.flush
      end

      puts ""
      puts "#{processed_count} records processed"

      drop_table :hours_acceptance_reasons

      change_table :hours_acceptance_periods do |t|
        t.remove :hours_acceptance_reason_id
      end
    end
  end

  def special_reasons
    [none_hour_acceptance_reason, other_hour_acceptance_reason]
  end

  def none_hour_acceptance_reason
    HoursAcceptanceReason.find_by!(text: 'none')
  end

  def other_hour_acceptance_reason
    HoursAcceptanceReason.find_by!(text: 'other')
  end
end
