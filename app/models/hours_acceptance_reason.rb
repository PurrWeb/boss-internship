class HoursAcceptanceReason < ActiveRecord::Base
  validates :text, presence: true
  validates :enabled, presence: true
  validates :rank, presence: true

  def self.none
    HoursAcceptanceReason.first
  end
end