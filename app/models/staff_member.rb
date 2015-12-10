class StaffMember < ActiveRecord::Base
  GENDERS = ['male', 'female']

  has_many :venues
  belongs_to :address, inverse_of: :staff_member
  accepts_nested_attributes_for :address, allow_destroy: false

  include Enableable

  validates :email, presence: true
  validates :gender, inclusion: { in: GENDERS, message: 'is required' }
  validates :phone_number, presence: true
  validates :enabled, presence: true
  validates :first_name, presence: true
  validates :surname, presence: true
  validates :date_of_birth, presence: true
  validates :address, presence: true
  validate  :national_insurance_number_valid

  before_validation :normalise_national_insurance_number

  def national_insurance_number_regex
    /[A-Z]{2}[0-9]{6}(A|B|C|D)/
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

  def full_name
    [first_name, surname].join(' ')
  end
end
