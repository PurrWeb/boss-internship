class EmailAddress < ActiveRecord::Base
  has_many :users, inverse_of: :email_address
  has_many :staff_members, inverse_of: :email_address

  auto_strip_attributes :email
  validates :email, presence: true, uniqueness: true

  validate :email_address_valid

  def bounced_data
    BouncedEmailAddress.find_by_email(email: email)
  end

  def email_address_valid
    return unless email.present?

    errors.add(
      :email,
      EmailAddress.invalid_email_address_message
    ) unless email =~ EmailAddress.email_address_regex
  end

  def unassigned?
    users.enabled.count == 0 &&
      staff_members.enabled.count == 0
  end

  def self.email_address_regex
    /^\S+@\S+$/
  end

  def self.invalid_email_address_message
    'must be a valid email address'
  end
end
