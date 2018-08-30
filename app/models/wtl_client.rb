class WtlClient < ActiveRecord::Base
  has_paper_trail

  UNIVERSITIES = ["The University of Liverpool"]
  GENDERS = ["male", "female", "other"]

  enum email_status: [:unverified, :verified]
  enum status: [:enabled, :disabled]

  # Associations
  belongs_to :wtl_card

  # Validations
  validates :first_name, presence: true
  validates :surname, presence: true
  validates_inclusion_of :gender, :in => WtlClient::GENDERS, :message => "a valid gender should be present"
  validates_inclusion_of :university, :in => WtlClient::UNIVERSITIES, :message => "a valid university should be present"
  validates :date_of_birth, presence: true
  validates :email, uniqueness: true, presence: true
  validates :wtl_card, uniqueness: true, presence: true

  validate :email_address_valid

  delegate :number, to: :wtl_card, prefix: :card

  def age(from: Time.current.utc)
    if date_of_birth.present?
      from_date = from.to_date
      from_date.year - date_of_birth.year - ((from_date.month > date_of_birth.month || (from_date.month == date_of_birth.month && from_date.day >= date_of_birth.day)) ? 0 : 1)
    end
  end

  def full_name
    "#{first_name} #{surname}"
  end

  def email_address_valid
    return unless email.present?

    errors.add(
      :email,
      EmailAddress.invalid_email_address_message
    ) unless email =~ EmailAddress.email_address_regex
  end
end
