class IncidentReport < ActiveRecord::Base
  belongs_to :user
  belongs_to :venue
  belongs_to :disabled_by, class_name: "User"

  validates :user, presence: true
  validates :venue, presence: true
  validates :time, presence: true
  validates :location, presence: true
  validates :description, presence: true
  validates :involved_witness_details, presence: true
  validates :uninvolved_witness_details, presence: true
  validates :police_officer_details, presence: true
  validates :recorded_by_name, presence: true
  validates :camera_name, presence: true
  validates :report_text, presence: true
  validate :disable_fields_correct

  def disable_fields_correct
    if disabled_at.present? ^ disabled_by.present?
      errors.add(:base, 'disabled user and time must both be present')
    end
  end
end
