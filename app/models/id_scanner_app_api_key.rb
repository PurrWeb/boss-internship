class IdScannerAppApiKey < ActiveRecord::Base
  belongs_to :creator, class_name: 'User', foreign_key: 'creator_user_id'
  belongs_to :disabled_by_user, class_name: 'User', foreign_key: 'disabled_by_user_id'

  validates :creator, presence: true
  validates :key, presence: true
  validates :name, presence: true
  validate  :protect_from_duplicates
  validate :disabled_fields

  before_validation :generate_key

  def generate_key
    return if persisted?
    begin
      self.key = SecureRandom.hex
    end while self.class.exists?(key: key)
  end

  def key_change
    return unless persisted?
    errors.add(:key, "can't be modified") if key_changed?
  end

  def protect_from_duplicates
    return if persisted?
    if name.present? && IdScannerAppApiKey.find_by(name: name).present?
      errors.add(:base, "key already exists with this name")
    end
  end

  # validation
  def disabled_fields
    if disabled_at.present? ^ disabled_by_user.present?
      if !disabled_at.present?
        errors.add(:disabled_at, 'is required')
      end

      if !disabled_by_user.present?
        errors.add(:disabled_by_user, 'is_required')
      end
    end
  end

  def self.active
    where(disabled_at: nil)
  end

  def enabled?
    !disabled_at
  end
end
