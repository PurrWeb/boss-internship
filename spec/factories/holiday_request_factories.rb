FactoryGirl.define do
  factory :holiday_request do
    validate_as_creation true
    start_date { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current + 1.week)).start_date }
    end_date { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current + 1.week)).start_date + 2.days }
    staff_member
    association :creator, factory: :user
    holiday_type { Holiday::PAID_HOLIDAY_TYPE }
  end
end
