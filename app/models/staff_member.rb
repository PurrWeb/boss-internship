class StaffMember < ActiveRecord::Base
  GENDERS = ['male', 'female']

  belongs_to :creator, class_name: 'User'
  belongs_to :staff_type
  has_one :staff_member_venue, inverse_of: :staff_member
  has_one :venue, through: :staff_member_venue
  accepts_nested_attributes_for :staff_member_venue

  belongs_to :address, inverse_of: :staff_member
  accepts_nested_attributes_for :address, allow_destroy: false

  belongs_to :name
  accepts_nested_attributes_for :name, allow_destroy: false

  belongs_to :email_address, inverse_of: :staff_members
  accepts_nested_attributes_for :email_address, allow_destroy: false

  has_one :user, inverse_of: :staff_member

  mount_uploader :avatar, AvatarUploader
  validates :avatar, {
    presence: true,
    file_size: { less_than: 1.megabyte }
  }

  include Enableable

  validates :name, presence: true
  validates :email_address, presence: true
  validates :gender, inclusion: { in: GENDERS, message: 'is required' }
  validates :phone_number, presence: true
  validates :enabled, presence: true
  validates :date_of_birth, presence: true
  validates :address, presence: true
  validate  :national_insurance_number_valid
  validates :pin_code, presence: true
  validate  :valid_pin_code_format
  validates :staff_type, presence: true
  validates :creator, presence: true
  validates :starts_at, presence: true

  before_validation :normalise_national_insurance_number

  def self.for_venue(venue)
    joins(:venue).merge(Venue.where(id: venue.id))
  end

  def valid_pin_code_format
    if pin_code.present?
      errors.add(:pin_code, 'must be numerical') unless pin_code.match(pin_code_regex)
    end
  end

  def pin_code_regex
    /^[0-9]+$/
  end

  def national_insurance_number_regex
    /^[A-Z]{2}[0-9]{6}(A|B|C|D)$/
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

  def hours_preference_help_text
    'Perferred number of hours to work per week displayed in the Rota (e.g. 40, 20+)'
  end

  def day_perference_help_text
    'Peferrered days to work displayed in the rota (e.g. mornings and weekeneds)'
  end
end
