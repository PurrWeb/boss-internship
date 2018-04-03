class HolidayRequest < ActiveRecord::Base
  belongs_to :staff_member
  belongs_to :creator, foreign_key: 'created_by_user_id', class_name: 'User'
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :holiday_type, inclusion: { in: Holiday::HOLIDAY_TYPES, message: 'is required' }

  def days
    day_delta = (end_date - start_date).to_i
    day_delta + 1
  end
end
