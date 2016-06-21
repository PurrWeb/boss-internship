FactoryGirl.define do
  factory :finance_report do
    week_start { RotaWeek.new(Time.current.to_date).start_date }
    staff_member
    staff_member_name 'Staff Member Name'
    venue
    venue_name 'Venue name'
    pay_rate_description 'Foo per hour'
    monday_hours_count 0
    tuesday_hours_count 0
    wednesday_hours_count 0
    thursday_hours_count 0
    friday_hours_count 0
    saturday_hours_count 0
    sunday_hours_count 0
    owed_hours_minute_count 0
    total_hours_count 0
    total_cents 0
    holiday_days_count 0
  end
end
