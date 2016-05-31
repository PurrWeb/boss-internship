class HoursAcceptanceReason < ActiveRecord::Base
  validates :text, presence: true
  validates :enabled, presence: true
end
