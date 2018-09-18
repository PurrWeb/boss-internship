class Invite < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  serialize :venue_ids, Array

  has_many :invite_transitions, autosave: false

  belongs_to :inviter, class_name: "User"
  belongs_to :revoker, class_name: "User"
  belongs_to :user

  before_validation :generate_token

  validates :role, presence: true, inclusion: { in: User::ROLES, message: 'is required' }

  validates :first_name, presence: true
  validates :surname, presence: true
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

  delegate :can_transition_to?, :transition_to, :transition_to!, :current_state, to: :state_machine

  validate :venues_ids_venues_exist, on: :create

  def venues_ids_venues_exist
    venue_ids.each do |id|
      Venue.find(id)
    end
  end

  def email_bounced_data
    BouncedEmailAddress.find_by_email(email: email)
  end

  def revoke!
    transition_to!(:revoked)
  end

  def accepted?
    current_state.to_sym == :accepted
  end

  def open?
    current_state.to_sym == :open
  end

  def revoked?
    current_state.to_sym == :revoked
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
      errors.add :base, "email is already taken"
    end
  end
end
