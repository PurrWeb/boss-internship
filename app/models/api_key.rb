class ApiKey < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries
  BOSS_KEY_TYPE = 'boss'
  POOL_HALL_KEY_TYPE = 'pool_hall'
  KEY_TYPES = [BOSS_KEY_TYPE, POOL_HALL_KEY_TYPE]

  belongs_to :venue
  belongs_to :user
  has_many :api_key_transitions, autosave: false

  validates :user, presence: true
  validates :key, presence: true
  validates :venue, presence: true, unless: :pool_hall_key?
  validates :key_type, inclusion: { in: KEY_TYPES, message: 'is required' }
  validate  :key_change
  validate  :protect_from_duplicates

  before_validation :generate_key

  attr_readonly :key_type

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
    if venue.present? && ApiKey.current_for(venue: venue).present?
      errors.add(:base, "venue already has an active api key")
    end
  end

  def boss_key?
    key_type == BOSS_KEY_TYPE
  end

  def pool_hall_key?
    key_type == POOL_HALL_KEY_TYPE
  end

  def self.active
    in_state(:active)
  end

  def self.boss
    where(key_type: BOSS_KEY_TYPE)
  end

  def self.pool_hall
    where(key_type: POOL_HALL_KEY_TYPE)
  end

  def self.current_for(venue:)
    active.
      where(venue: venue).
      first
  end

  def state_machine
    @state_machine ||= ApiKeyStateMachine.new(
      self,
      transition_class: ApiKeyTransition,
      association_name: :api_key_transitions
    )
  end

  private
  # Needed for statesman
  def self.transition_class
    ApiKeyTransition
  end

  def self.initial_state
    ApiKeyStateMachine.initial_state
  end
end
