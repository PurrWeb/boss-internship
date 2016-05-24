class HoursAcceptancePeriodReason < ActiveRecord::Base
  validates :rank, presence: true, uniqueness: true
  validates :text, presence: true
end
