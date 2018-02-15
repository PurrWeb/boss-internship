class OpsDiary < ActiveRecord::Base
  belongs_to :created_by_user, class_name: "User"
  belongs_to :venue

  enum priority: [:low, :medium, :high]

  scope :active, -> { where(disabled_at: nil) }
  scope :disabled, -> { where.not(disabled_at: nil) }

  validates :title, presence: true
  validates :priority, presence: true
  validates :venue, presence: true
  validates :created_by_user, presence: true
  validates :text, presence: true

  def enabled?
    !disabled_at.present?
  end

end
