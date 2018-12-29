# Generates owed hours from output of GetNewYearHours service
class AddNewYearsOwedHours
  def initialize(new_years_hour_data:)
    @new_years_hour_data = new_years_hour_data
  end
  attr_reader :new_years_hour_data

  def call
    system_user = User.first

    ActiveRecord::Base.transaction do
      new_years_hour_data.each do |new_years_hours_datum|
        date = new_years_hours_datum.fetch(:date)
        staff_member = StaffMember.find(new_years_hours_datum.fetch(:staff_member_id))
        owed_hour_duration_minutes = new_years_hours_datum.fetch(:extra_minutes_required)
        owed_hour_note = new_years_hours_datum.fetch(:owed_hour_description)

        if owed_hour_duration_minutes > 0
          result = CreateOwedHour.new(
            params: {
              staff_member: staff_member,
              creator: system_user,
              minutes: owed_hour_duration_minutes,
              date: date,
              note: owed_hour_note,
              require_times: false,
            }
          ).call

          raise ActiveRecord::Rollback unless result
        end
      end
    end
  end
end
