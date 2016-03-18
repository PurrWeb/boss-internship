class User < ActiveRecord::Base
  ROLES = ['admin', 'manager', 'dev', 'ops_manager', 'security_manager']

  include Statesman::Adapters::ActiveRecordQueries

  has_many :venues, through: :venue_users
  has_many :venue_users

  belongs_to :staff_member

  belongs_to :name
  accepts_nested_attributes_for :name, allow_destroy: false

  belongs_to :email_address, inverse_of: :users
  accepts_nested_attributes_for :email_address, allow_destroy: false

  has_many :user_transitions, autosave: false

  belongs_to :invite

  # Include default devise modules. Others available are:
  # :registerable, :timeoutable, :validatable, and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
          :lockable, :authentication_keys => [:devise_email]

  validates :role, inclusion: { in: ROLES, message: 'is required' }
  validates :name, presence: true
  validates :email_address, presence: true
  validates :invite, presence: true, unless: :first?

  delegate :current_state, to: :state_machine

  delegate \
    :full_name,
    :first_name,
    :surname,
    to: :name

  def self.enabled
    in_state(:enabled)
  end

  def self.disabled
    in_state(:disabled)
  end

  def self.with_email(email)
    joins(:email_address).merge(EmailAddress.where(email: email))
  end

  def email
    email_address.try(:email) || @email
  end

  #Needed for devise controllers
  def email=(value)
    @email = value
  end

  def can_create_roles
    if dev? || admin?
      ROLES - ['dev']
    else
      []
    end
  end

  def can_edit_roles
    if dev?
      ROLES
    elsif admin?
      ROLES - ['dev']
    else
      []
    end
  end

  def enabled?
    state_machine.current_state == 'enabled'
  end

  def disabled?
    state_machine.current_state == 'disabled'
  end

  def admin?
    role == 'admin'
  end

  def dev?
    role == 'dev'
  end

  def manager?
    role == 'manager'
  end

  def ops_manager?
    role == 'ops_manager'
  end

  def security_manager?
    role == 'security_manager'
  end

  def has_all_venue_access?
    dev? || admin? || ops_manager?
  end

  def has_admin_access?
    dev? || admin?
  end

  def active_for_authentication?
    enabled?
  end

  def inactive_message
    'This account is disabled'
  end

  def status
    enabled? ? 'Active' : 'Disabled'
  end

  # Required to stop devise complaining about not using a proper email field
  def email_changed?
    false
  end

  def state_machine
    @state_machine ||= UserStateMachine.new(
      self,
      transition_class: UserTransition,
      association_name: :user_transitions
    )
  end

  def disable_reason
    disabled? && state_machine.last_transition.metadata.fetch("disable_reason")
  end

  # Needed for statesman
  def self.transition_class
    UserTransition
  end

  def self.initial_state
    UserStateMachine.initial_state
  end

  # Required for devise to work with non-standard email setup
  def self.find_first_by_auth_conditions(conditions={})
    if conditions.has_key?(:reset_password_token)
      enabled.
        where(reset_password_token: conditions.fetch(:reset_password_token)).
        first
    elsif conditions.has_key?(:email)
      enabled.
        joins(:email_address).
        merge(
          EmailAddress.where(email: conditions.fetch(:email))
        ).first
    end
  end

  # Required for devise to work with non-standard email setup
  def self.find_for_database_authentication(warden_conditions={})
    conditions = warden_conditions.dup
    if email = conditions.delete(:devise_email)
      where(conditions.to_hash).
        joins(:email_address).
        merge(EmailAddress.where(email: email)).
        first
    else
      where(conditions.to_hash).first
    end
  end

  # Required for devise to work without email field
  def devise_email=(devise_email)
    @devise_email = devise_email
  end

  # Required for devise to work without email field
  def devise_email
    @devise_email || email
  end

  # Required for devise to work without email field
  def email_required?
    false
  end
end
