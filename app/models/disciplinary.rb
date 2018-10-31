class Disciplinary < ActiveRecord::Base
  enum level: [:first_level, :second_level, :final_level]

  LEVELS_TEXT = {
    Disciplinary.levels.keys[0] => "Verbal warning",
    Disciplinary.levels.keys[1] => "Written warning",
    Disciplinary.levels.keys[2] => "Final written warning",
  }

  EXPIRATION_LEVEL_DESCRIPTION = {
    Disciplinary.levels.keys[0] => "6 months",
    Disciplinary.levels.keys[1] => "6 months",
    Disciplinary.levels.keys[2] => "12 month",
  }

  EXPIRATION_LIMITS = {
    Disciplinary.levels.keys[0] => 6.month,
    Disciplinary.levels.keys[1] => 6.month,
    Disciplinary.levels.keys[2] => 12.month,
  }

  belongs_to :staff_member
  belongs_to :created_by_user, class_name: "User"
  belongs_to :disabled_by_user, class_name: "User"

  validates :title, presence: true
  validates :level, inclusion: {in: Disciplinary.levels.keys, message: :invalid}, presence: true
  validates :conduct, presence: true
  validates :consequence, presence: true
  validates :nature, presence: true
  validates :staff_member, presence: true
  validates :created_by_user, presence: true

  scope :without_expired, -> {
      where("(level = ? AND created_at > ?) OR (level = ? AND created_at > ?) OR (level = ? AND created_at > ?)",
            0, Time.zone.now - Disciplinary::EXPIRATION_LIMITS[Disciplinary::levels.keys[0]],
            1, Time.zone.now - Disciplinary::EXPIRATION_LIMITS[Disciplinary::levels.keys[1]],
            2, Time.zone.now - Disciplinary::EXPIRATION_LIMITS[Disciplinary::levels.keys[2]])
    }
  scope :without_disabled, -> { where({disabled_at: nil, disabled_by_user: nil}) }

  def expired?
    expired_at < Time.zone.now
  end

  def expired_at
    created_at + EXPIRATION_LIMITS[level]
  end

  def expiration_description
    EXPIRATION_LEVEL_DESCRIPTION[level]
  end

  def warning_level_text
    LEVELS_TEXT[level]
  end
end
