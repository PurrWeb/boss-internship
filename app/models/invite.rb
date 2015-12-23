class Invite < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  has_many :invite_transitions, autosave: false

  belongs_to :inviter, class_name: "User"
  belongs_to :revoker, class_name: "User"
  belongs_to :user

  before_validation :generate_token

  validates :role, presence: true

  validates :token, presence: true, uniqueness: true

  validates :email,
    presence:   true,
    format:     { with: /\A[^@]+@[^@]+\z/ },
    uniqueness: {
      conditions: -> { merge(Invite.in_state(:open)) },
      message: "has already been invited",
      case_sensitive: false,
      if: :open?
    }

  validate :user_doesnt_already_exist, on: :create

  delegate :transition_to, :transition_to!, :current_state, to: :state_machine

  def accepted?
    current_state.to_sym == :accepted
  end

  def open?
    current_state.to_sym == :open
  end

  def generate_token
    self.token ||= SecureRandom.hex
  end

  def state_machine
    @state_machine ||= InviteStateMachine.new(
      self,
      transition_class: InviteTransition,
      association_name: :invite_transitions
    )
  end

  private
  # Needed for statesman
  def self.transition_class
    InviteTransition
  end

  def self.initial_state
    InviteStateMachine.initial_state
  end

  def user_doesnt_already_exist
    if email.present? && (User.joins(:email_address).merge(EmailAddress.where(email: email))).present?
      errors.add :email, "is already signed up"
    end
  end
end
