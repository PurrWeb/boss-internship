class TimeDodgerReviewAction < ActiveRecord::Base
  belongs_to :time_dodger_offence_level
  belongs_to :creator_user, class_name: 'User'
  belongs_to :disabled_by_user, class_name: 'User'

  validates :creator_user, presence: true
  validates :time_dodger_offence_level, presence: true
  validates :review_level, presence: true
  validates :disabled_at, :disabled_by_user, presence: true, if: :disabled?
  validates :note, presence: true

  scope :enabled, -> { where({disabled_at: nil, disabled_by_user: nil}) }

  def disabled?
    disabled_at.present? && disabled_by_user.present?
  end
end
