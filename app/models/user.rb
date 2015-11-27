class User < ActiveRecord::Base
  ROLES = ['admin', 'manager', 'staff']
  GENDERS = ['m', 'f']

  include Enableable

  # Include default devise modules. Others available are:
  # :registerable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
         :validatable, :lockable, :confirmable

  validates :role, presence: true, inclusion: { in: ROLES }
  validates :gender, presence: true, inclusion: { in: GENDERS }
  validates :phone_number, presence: true
  validates :enabled, presence: true
  validates :first_name, presence: true
  validates :sir_name, presence: true
  validates :date_of_birth, presence: true
  validate  :national_insurance_number_valid
  validate  :password_is_numerical

  before_validation :normalise_national_insurance_number

  def password_is_numerical
    if password.present? && !/[0-9]+/.match(password)
      errors.add(:password, 'must be numerical')
    end
  end

  def national_insurance_number_regex
    /[A-Z]{2}[0-9]{6}(A|B|C|D)/
  end

  def normalise_national_insurance_number
    if national_insurance_number.present? &&
      !national_insurance_number_regex.match(national_insurance_number)
      self.national_insurance_number = national_insurance_number.gsub(/(\W|_)/,'')
    end
  end

  def national_insurance_number_valid
    if national_insurance_number.present? &&
      !national_insurance_number_regex.match(national_insurance_number)
      errors.add(:national_insurance_number, 'format must be 2 letters, followed by 6 numbers, and a letter ')
    end
  end
end
