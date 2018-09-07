class WtlClient < ActiveRecord::Base
  has_paper_trail

  UNIVERSITIES = [
    "university_of_liverpool",
    "liverpool_john_moores",
    "liverpool_hope_university",
    "edge_hill_university",
    "liverpool_institute_for_performing_arts"
  ]
  GENDERS = ["male", "female", "other"]

  enum email_status: [:unverified, :verified]
  enum status: [:enabled, :disabled]

  # Associations
  belongs_to :wtl_card

  # Validations
  validates :first_name, presence: true
  validates :surname, presence: true
  validates :verification_token, presence: true
  validates_inclusion_of :gender, :in => WtlClient::GENDERS, :message => "a valid gender should be present"
  validates_inclusion_of :university, :in => WtlClient::UNIVERSITIES, :message => "a valid university should be present"
  validates :date_of_birth, presence: true
  validates :email, uniqueness: {message: "Account suspended"}
  validates :email, presence: true
  validates :wtl_card, presence: true, if: :from_registration?
  validates :wtl_card, uniqueness: true

  validate :email_address_valid

  delegate :number, to: :wtl_card, prefix: :card, allow_nil: true

  attr_writer :from_registration

  def from_registration?
    @from_registration == false ? false : true
  end

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

  def verify!(now: Time.current)
    update_attributes!(verified_at: now)
  end

  def verified?
    verified_at.present?
  end
end
