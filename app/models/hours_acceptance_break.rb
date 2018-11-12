class HoursAcceptanceBreak < ActiveRecord::Base
  has_paper_trail

  belongs_to :hours_acceptance_period
  belongs_to :disabled_by, polymorphic: true

  validates :hours_acceptance_period, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :disable_valid

  include HoursAcceptanceBreakTimeValidations

  def self.enabled
    where(disabled_at: nil)
  end

  def disable_valid
    if disabled_at.present? && !disabled_by.present?
      errors.add(:disabled_by, 'required when disabling')
    end
  end

  def disabled?
    disabled_at.present?
  end

  def disable(requester:)
    update_attributes(
      disabled_at: Time.current,
      disabled_by: requester
    )
  end

  def hour_length
    (ends_at - starts_at) / 1.hour
  end
end
