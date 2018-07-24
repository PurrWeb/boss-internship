class Disciplinary < ActiveRecord::Base
  enum level: [ :first_level, :second_level, :final_level ]

  EXPIRATION_LIMIT = 2.month

  belongs_to :staff_member
  belongs_to :created_by_user, class_name: "User"
  belongs_to :disabled_by_user, class_name: "User"

  validates :title, presence: true
  validates :level, inclusion: { in: Disciplinary.levels.keys, message: :invalid }, presence: true
  validates :note, presence: true
  validates :staff_member, presence: true
  validates :created_by_user, presence: true

  def expired?
    expired_at < Time.now
  end

  def expired_at
    created_at + EXPIRATION_LIMIT
  end
end
