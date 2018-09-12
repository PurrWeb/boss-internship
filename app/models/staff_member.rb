class StaffMember < ActiveRecord::Base
  has_secure_password validations: false

  MALE_GENDER = 'male'
  FEMALE_GENDER = 'female'

  GENDERS = [MALE_GENDER, FEMALE_GENDER]

  NATIONAL_INSURANCE_NUMBER_REGEX = /^[A-Z]{2}[0-9]{6}(A|B|C|D|F)$/

  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :creator, class_name: 'User'
  belongs_to :staff_type

  has_many :staff_member_venues, inverse_of: :staff_member
  has_many :finance_reports
  has_many :work_venues, through: :staff_member_venues, source: :venue
  belongs_to :master_venue, class_name: 'Venue', inverse_of: :master_staff_members

  has_many :clock_in_days
  has_many :accessory_requests
  has_many :accessory_refund_requests

  belongs_to :address, inverse_of: :staff_member
  accepts_nested_attributes_for :address, allow_destroy: false

  belongs_to :name
  accepts_nested_attributes_for(
    :name,
    allow_destroy: false,
    update_only: true
  )

  belongs_to :email_address, inverse_of: :staff_members
  accepts_nested_attributes_for :email_address, allow_destroy: false

  has_one :user, inverse_of: :staff_member

  has_many :rota_shifts, inverse_of: :staff_member
  has_many :enabled_rota_shifts, lambda { RotaShift.enabled }, class_name: "RotaShift"

  has_many :holidays, inverse_of: :staff_member

  has_many :holiday_requests, inverse_of: :staff_member

  has_many :owed_hours, inverse_of: :staff_member

  has_many :staff_member_transitions, autosave: false

  belongs_to :pay_rate

  scope :weekly_finance_reports, -> (date) { joins(:finance_reports).where(finance_reports: {week_start: date})  }
  scope :with_aged_payrates, -> { joins(:pay_rate).where(pay_rates: { name: PayRate::AGED_PAYRATE_NAMES }) }

  mount_uploader :avatar, AvatarUploader
  validates :avatar, {
    file_size: { less_than: 1.megabyte }
  }

  validates :password, length: (6..32), confirmation: true, if: :setting_password?

  auto_strip_attributes :sage_id, convert_non_breaking_spaces: true, squish: true

  # Transient attribute used to preserve image uploads
  # during form resubmissions
  attr_accessor \
    :avatar_base64,
    :pin_code,
    # Attrs below used in `venue_update_access` validate method,
    # to check if the user have an access to staff member work_venues when he updates
    # staff member employment details in `UpdateStaffMemberEmploymentDetails` service `call` method
    :has_master_venue_without_access,
    :has_pay_rate_without_access,
    :work_venues_without_access


  before_save :encrypt_pin_code

  validates :name, presence: true
  validates :rollbar_guid, presence: true
  validates :gender, inclusion: { in: GENDERS, message: 'is required' }
  validate  :national_insurance_number_valid
  validates :pin_code, presence: true, on: :create
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
  validate :pay_rate_update_access
  validate :venue_update_access

  validates :employment_status_a, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_b, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_c, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_d, inclusion: { in: [true, false], message: 'is required' }
  validates :employment_status_p45_supplied, inclusion: { in: [true, false], message: 'is required' }

  validates :would_rehire, inclusion: { in: [true, false], message: 'is required' }

  before_validation :normalise_national_insurance_number
  before_validation :check_rollbar_guid

  delegate :current_state, to: :state_machine

  def expire_security_app_tokens!
    SecurityAppApiAccessToken.revoke!(user: self)
  end

  def current_security_app_access_token
    SecurityAppApiAccessToken.find_by_staff_member(staff_member: self).last
  end

  def verified?
    self.verified_at.present?
  end

  def verifiable?
    !self.verified? && self.verification_token.present?
  end

  def pay_rate_update_access
    if has_pay_rate_without_access
      errors.add(:pay_rate, :invalid, message: "You don't have access to `#{pay_rate.name}` pay rate.")
    end
  end

  def venue_update_access
    if has_master_venue_without_access
        errors.add(:master_venue, :invalid, message: "You don't have access to venue `#{master_venue.name}`.")
    end
    if work_venues_without_access && (work_venues_without_access.count > 0)
      errors.add(:work_venues, :invalid, message: "You don't have access to venues: `#{work_venues_without_access.join(", ")}`.")
    end
  end

  def encrypt_pin_code
    if pin_code.present?
      self.pin_code_hash = BCrypt::Engine.hash_secret(pin_code, pin_code_salt)
    end
  end

  def pin_code_valid?(pin_code)
    pin_code_hash == BCrypt::Engine.hash_secret(pin_code, pin_code_salt)
  end

  def pin_code_salt
    self.pin_code_salt = BCrypt::Engine.generate_salt unless super.present?
    super
  end

  def self.for_venue(venue)
    for_venues(venue_ids: [venue.id])
  end

  def self.for_venues(venue_ids:)
    with_matching_master_venue = StaffMember.
      where(master_venue_id: venue_ids)

    with_matching_work_venue = StaffMember.
      joins(:work_venues).
      merge(
        Venue.where(id: venue_ids)
      )

    ids = with_matching_master_venue.pluck(:id) + with_matching_work_venue.pluck(:id)
    where(id: ids.uniq)
  end

  def self.can_have_finance_reports
    joins("LEFT JOIN `staff_types` as `has_finance_reports_staff_types` on `has_finance_reports_staff_types`.id = `staff_members`.staff_type_id").where('`has_finance_reports_staff_types`.role != ?', StaffType::SECURITY_ROLE)
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

  def self.flagged
    disabled.where(would_rehire: false)
  end

  # Does not include enabled staff members as this can't
  # be composed easily
  def self.not_flagged
    disabled.where(would_rehire: true)
  end

  def self.mark_requiring_notification!(time: Time.current)
    update_all(shift_change_occured_at: time)
  end

  def self.unnotified_of_sia_expiry
    where(notified_of_sia_expiry_at: nil)
  end

  def age(from: Time.current.utc)
    if date_of_birth.present?
      from_date = from.to_date
      from_date.year - date_of_birth.year - ((from_date.month > date_of_birth.month || (from_date.month == date_of_birth.month && from_date.day >= date_of_birth.day)) ? 0 : 1)
    end
  end

  def disabled_by_user
    if disabled?
      User.find(state_machine.last_transition.metadata.fetch("requster_user_id"))
    end
  end

  def flagged?
    disabled? && would_rehire == false
  end

  def enabled?
    state_machine.current_state == 'enabled'
  end

  def disabled?
    state_machine.current_state == 'disabled'
  end

  def disabled_at
    if disabled?
      state_machine.last_transition.created_at
    end
  end

  def security?
    staff_type.andand.security?
  end

  def bar_supervisor?
    staff_type.andand.bar_supervisor?
  end

  def general_manager?
    staff_type.andand.general_manager?
  end

  def manager?
    staff_type.andand.manager?
  end

  def name_changed?
    name_id_changed? ||
      name.first_name_changed? ||
      name.surname_changed?
  end

  def email_changed?
    email_address.andand.email_changed?
  end

  def staff_type_changed?
    staff_type_id_changed?
  end

  def pay_rate_changed?
    pay_rate_id_changed?
  end

  def clocked_out_for_venue?(date:, venue:)
    clock_in_days = ClockInDay.where(
      date: date,
      venue: venue,
      staff_member: self
    )

    clock_in_days.count == 0 || clock_in_days.all? do |clock_in_day|
      clock_in_day.current_clock_in_state == :clocked_out
    end
  end

  def clocked_out_everywhere?(date:)
    clock_in_days = ClockInDay.where(
      date: date,
      staff_member: self
    )

    clock_in_days.count == 0 || clock_in_days.all? do |clock_in_day|
      clock_in_day.current_clock_in_state == :clocked_out
    end
  end

  def address_changed?
    address &&
      (address.address_changed?  ||
       address.county_changed?   ||
       address.country_changed?  ||
       address.postcode_changed?)
  end

  def pending_holiday_requests
    holiday_requests.in_state(:pending)
  end

  def active_holidays
    holidays.in_state(:enabled)
  end

  def active_owed_hours
    owed_hours.enabled
  end

  def valid_pin_code_format
    if pin_code.present?
      errors.add(:pin_code, 'must be numerical') unless pin_code.match(pin_code_regex)
    end
  end

  def on_weekly_pay_rate?
    pay_rate.andand.weekly?
  end

  def on_hourly_pay_rate?
    pay_rate.andand.hourly?
  end

  def disable_reason
    state_machine.last_transition.metadata.fetch("disable_reason") if disabled?
  end

  def pin_code_regex
    /^[0-9]+$/
  end

  def normalise_national_insurance_number
    if national_insurance_number.present? &&
      !NATIONAL_INSURANCE_NUMBER_REGEX.match(national_insurance_number)
      self.national_insurance_number = national_insurance_number.upcase.gsub(/(\W|_)/,'')
    end
  end

  def national_insurance_number_valid
    if national_insurance_number.present? &&
      !NATIONAL_INSURANCE_NUMBER_REGEX.match(national_insurance_number)
      errors.add(:national_insurance_number, 'format must be 2 letters, followed by 6 numbers, and a letter ')
    end
  end

  delegate :full_name, to: :name

  def email
    email_address.try(:email)
  end

  def workable_venues
    StaffMemberWorkableVenuesQuery.new(staff_member: self).all
  end

  def mark_requiring_notification!(time: Time.zone.now)
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

  def has_user?
    user.present? && user.enabled?
  end

  def can_have_finance_reports?
    !security?
  end

  private
  def setting_password?
    password || password_confirmation
  end

  # Needed for statesman
  def self.transition_class
    StaffMemberTransition
  end

  def self.initial_state
    StaffMemberStateMachine.initial_state
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
