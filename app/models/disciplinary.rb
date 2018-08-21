class Disciplinary < ActiveRecord::Base
  enum level: [ :first_level, :second_level, :final_level ]

  EXPIRATION_LIMIT = 2.month

  belongs_to :staff_member
  belongs_to :created_by_user, class_name: "User"
  belongs_to :disabled_by_user, class_name: "User"

  validates :title, presence: true
  validates :level, inclusion: { in: Disciplinary.levels.keys, message: :invalid }, presence: true
  validates :conduct, presence: true
  validates :consequence, presence: true
  validates :nature, presence: true
  validates :staff_member, presence: true
  validates :created_by_user, presence: true

  scope :without_expired, -> { where("created_at > ?", Time.zone.now - EXPIRATION_LIMIT) }
  scope :without_disabled, -> { where({ disabled_at: nil, disabled_by_user: nil }) }

  def expired?
    expired_at < Time.zone.now
  end

  def expired_at
    created_at + EXPIRATION_LIMIT
  end
end
