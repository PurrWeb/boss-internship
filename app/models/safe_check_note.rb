class SafeCheckNote < ActiveRecord::Base
  belongs_to :created_by, class_name: 'User', foreign_key: :created_by_user_id
  belongs_to :disabled_by, class_name: 'User', foreign_key: :disabled_by_user
  belongs_to :safe_check

  validates :safe_check, presence: true
  validates :created_by, presence: true
  validates :note_left_by_note, presence: true
  validates :note_text, presence: true
  validates :disabled_by, presence: true, if: :disabled?

  auto_strip_attributes :note_left_by_note, convert_non_breaking_spaces: true, squish: false
  auto_strip_attributes :note_text, convert_non_breaking_spaces: true, squish: false

  def self.enabled
    where(disabled_at: nil)
  end

  def disabled?
    disabled_at.present?
  end
end
