class DashboardMessage < ActiveRecord::Base
  # Constants
  STATUS_LIVE = 'live'.freeze
  STATUS_DISABLED = 'disabled'.freeze

  # Associations
  belongs_to :created_by_user, class_name: 'User'
  belongs_to :disabled_by_user, class_name: 'User'
  has_and_belongs_to_many :venues

  # Validations
  validates :title, :message, :published_time, presence: true
  validates :venues, presence: true, if: Proc.new { |d| !d.to_all_venues? }

  scope :disabled, -> { where.not(disabled_at: nil) }
  scope :enabled, -> { where(disabled_at: nil) }

  def status
    if disabled_at.present? || disabled_by_user.present?
      STATUS_DISABLED
    else
      STATUS_LIVE
    end
  end

  def disable(user)
    update(
      disabled_at: Time.now,
      disabled_by_user: user
    )
  end

  def restore
    update(
      disabled_at: nil,
      disabled_by_user: nil
    )
  end
end
