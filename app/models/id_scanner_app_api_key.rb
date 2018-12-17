class IdScannerAppApiKey < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :creator, class_name: 'User', foreign_key: 'creator_user_id'
  has_many :api_key_transitions, autosave: false

  validates :creator, presence: true
  validates :key, presence: true
  validates :name, presence: true
  validate  :protect_from_duplicates

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
    if name.present? && IdScannerAppApiKey.find_by(name: name).present?
      errors.add(:base, "key already exists with this name")
    end
  end

  def self.active
    in_state(:active)
  end

  def state_machine
    @state_machine ||= IdScannerAppApiKeyStateMachine.new(
      self,
      transition_class: IdScannerAppApiKeyTransition,
      association_name: :api_key_transitions
    )
  end

  private
  # Needed for statesman
  def self.transition_class
    IdScannerAppApiKeyTransition
  end

  def self.initial_state
    IdScannerAppApiKeyStateMachine.initial_state
  end
end
