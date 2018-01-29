class User < ActiveRecord::Base
  MARKETING_ROLE = 'marketing'
  MAINTENANCE_ROLE = 'maintenance_staff'
  ROLES = ['admin', 'manager', 'dev', 'ops_manager', 'security_manager', MAINTENANCE_ROLE, MARKETING_ROLE]

  include Statesman::Adapters::ActiveRecordQueries

  has_many :venues, through: :venue_users
  has_many :incident_reports
  has_many :machines, foreign_key: "created_by_user_id", class_name: "Machine"
  has_many :machines_refloats
  has_many :disabled_incident_reports, foreign_key: "disabled_by_id", class_name: "IncidentReport"
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

  before_validation :check_rollbar_guid

  validates :rollbar_guid, presence: true
  validates :role, inclusion: { in: ROLES, message: 'is required' }
  validates :name, presence: true
  validates :email_address, presence: true
  validates :invite, presence: true, unless: :first?

  before_create :generate_rollbar_guid

  delegate :current_state, to: :state_machine

  delegate \
    :full_name,
    :first_name,
    :surname,
    to: :name

  def self.dev
    where(role: 'dev')
  end

  def self.enabled
    in_state(:enabled)
  end

  def self.disabled
    in_state(:disabled)
  end

  def self.with_email(email)
    joins(:email_address).merge(EmailAddress.where(email: email))
  end

  def self.maintenance_staff
    where(role: MAINTENANCE_ROLE)
  end

  def self.with_all_venue_access
    where(
      "role = ? OR role = ? OR role = ?",
      'dev',
      'admin',
      'ops_manager'
    )
  end

  def expire_web_tokens!
    WebApiAccessToken.revoke!(user: self)
  end

  def current_access_token
    current_web_access_tokens.last
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

  def whodunnit_data
    {
      class: 'User',
      id: id,
      name: full_name
    }
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

  def marketing_staff?
    role == MARKETING_ROLE
  end

  def ops_manager?
    role == 'ops_manager'
  end

  def security_manager?
    role == 'security_manager'
  end

  def maintenance_staff?
    role == MAINTENANCE_ROLE
  end

  def restricted_access?
    maintenance_staff? || security_manager? || marketing_staff?
  end

  # Warning: Couple this to access control for actions as it is used by restricted  # user types who don't have limited views of venues but who shouldn't have
  # access to certain admin like pages .
  def has_all_venue_access?
    dev? || admin? || ops_manager? || maintenance_staff?
  end

  def has_admin_access?
    dev? || admin?
  end

  def active_for_authentication?
    enabled?
  end

  def disabled_by_user
    if disabled?
      User.find(state_machine.last_transition.metadata.fetch("requster_user_id"))
    end
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

  def default_venue
    if manager?
      venues.first
    else
      Venue.first
    end
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

  private
  def current_web_access_tokens
    WebApiAccessToken.find_by_user(user: self)
  end

  def check_rollbar_guid
    unless rollbar_guid.present?
      generate_rollbar_guid
    end
  end

  def generate_rollbar_guid
    self.rollbar_guid = SecureRandom.uuid
  end
end
