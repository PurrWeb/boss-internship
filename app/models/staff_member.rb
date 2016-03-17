class StaffMember < ActiveRecord::Base
  GENDERS = ['male', 'female']

  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :creator, class_name: 'User'
  belongs_to :staff_type
  has_one :staff_member_venue, inverse_of: :staff_member
  has_one :venue, through: :staff_member_venue
  accepts_nested_attributes_for :staff_member_venue, reject_if: :all_blank

  belongs_to :address, inverse_of: :staff_member
  accepts_nested_attributes_for :address, allow_destroy: false

  belongs_to :name
  accepts_nested_attributes_for :name, allow_destroy: false

  belongs_to :email_address, inverse_of: :staff_members
  accepts_nested_attributes_for :email_address, allow_destroy: false

  has_one :user, inverse_of: :staff_member

  has_many :rota_shifts, inverse_of: :staff_member

  has_many :holidays, inverse_of: :staff_member

  has_many :staff_member_transitions, autosave: false

  belongs_to :pay_rate

  mount_uploader :avatar, AvatarUploader
  validates :avatar, {
    presence: true,
    file_size: { less_than: 1.megabyte }
  }

  # Transient attribute used to preserve image uploads
  # during form resubmissions
  attr_accessor :avatar_base64

  validates :name, presence: true
  validates :gender, inclusion: { in: GENDERS, message: 'is required' }
  validate  :national_insurance_number_valid
  validates :pin_code, presence: true
  validate  :valid_pin_code_format
  validates :staff_type, presence: true
  validates :creator, presence: true
  validates :starts_at, presence: true
  validates :pay_rate, presence: true
  validate do |staff_member|
    StaffMemberVenueValidator.new(staff_member).validate
  end
  validate  do |staff_member|
    SecurityStaffMemberValidator.new(staff_member).validate
  end

  validates :employment_status_a, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_b, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_c, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_d, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_p45_supplied, inclusion: { in: [true, false], message: 'is required' }

  validates :would_rehire, inclusion: { in: [true, false], message: 'is required' }

  before_validation :normalise_national_insurance_number

  delegate :current_state, to: :state_machine

  def self.for_venue(venue)
    joins(:venue).merge(Venue.where(id: venue.id))
  end

  def self.security
    joins(:staff_type).merge(StaffType.security)
  end

  def self.enabled
    in_state(:enabled)
  end

  def self.disabled
    in_state(:disabled)
  end

  def enabled?
    state_machine.current_state == 'enabled'
  end

  def disabled?
    state_machine.current_state == 'disabled'
  end

  def security?
    staff_type.andand.security?
  end

  def active_holidays
    holidays.in_state(:enabled)
  end

  def valid_pin_code_format
    if pin_code.present?
      errors.add(:pin_code, 'must be numerical') unless pin_code.match(pin_code_regex)
    end
  end

  def disable_reason
    disabled? && state_machine.last_transition.metadata.fetch("disable_reason")
  end

  def pin_code_regex
    /^[0-9]+$/
  end

  def national_insurance_number_regex
    /^[A-Z]{2}[0-9]{6}(A|B|C|D|F)$/
  end

  def normalise_national_insurance_number
    if national_insurance_number.present? &&
      !national_insurance_number_regex.match(national_insurance_number)
      self.national_insurance_number = national_insurance_number.upcase.gsub(/(\W|_)/,'')
    end
  end

  def national_insurance_number_valid
    if national_insurance_number.present? &&
      !national_insurance_number_regex.match(national_insurance_number)
      errors.add(:national_insurance_number, 'format must be 2 letters, followed by 6 numbers, and a letter ')
    end
  end

  delegate :full_name, to: :name

  def email
    email_address.try(:email)
  end

  def mark_requiring_notification!(time: Time.now)
    update_attributes!(shift_change_occured_at: time)
  end

  def mark_notified!
    update_attributes!(shift_change_occured_at: nil)
  end

  def requires_notification?
    shift_change_occured_at.present?
  end

  def hours_preference_help_text
    'Perferred number of hours to work per week displayed in the Rota (e.g. 40, 20+)'
  end

  def day_perference_help_text
    'Peferrered days to work displayed in the rota (e.g. mornings and weekeneds)'
  end

  def state_machine
    @state_machine ||= StaffMemberStateMachine.new(
      self,
      transition_class: StaffMemberTransition,
      association_name: :staff_member_transitions
    )
  end

  private
  # Needed for statesman
  def self.transition_class
    StaffMemberTransition
  end

  def self.initial_state
    StaffMemberStateMachine.initial_state
  end
end
