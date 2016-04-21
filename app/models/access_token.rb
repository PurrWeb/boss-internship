class AccessToken < ActiveRecord::Base
  TYPES = ['web', 'api']

  belongs_to :user
  belongs_to :staff_member

  belongs_to :creator, polymorphic: true
  has_many   :access_token_transitions, autosave: false

  validates :token, presence: true, uniqueness: true
  validates :token_type, inclusion: { in: TYPES, message: 'is required' }
  validates :creator, presence: true
  validate  :ensure_user_or_staff_member_set

  before_validation :generate_access_token

  def self.create_web!(user:)
    create!(
      token_type: 'web',
      expires_at: nil,
      creator: user,
      user: user
    )
  end

  def ensure_user_or_staff_member_set
    unless user.present? ^ staff_member.present?
      errors.base(add: 'one user or staff member must be set')
    end
  end

  def generate_access_token
    return if persisted?
    begin
      self.token = SecureRandom.hex
    end while self.class.exists?(token: token)
  end

  def state_machine
    @state_machine ||= AccessTokenStateMachine.new(
      self,
      transition_class: AccessTokenTransition,
      association_name: :access_token_transitions
    )
  end

  def web?
    token_type == 'web'
  end

  def api?
    token_type == 'api'
  end

  private
  # Needed for statesman
  def self.transition_class
    AccessTokenTransition
  end

  def self.initial_state
    AccessTokenStateMachine.initial_state
  end
end
