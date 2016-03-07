class EmailAddress < ActiveRecord::Base
  has_many :users, inverse_of: :email_address
  has_many :staff_members, inverse_of: :email_address

  validates :email, presence: true, uniqueness: true

  def unassigned?
    users.enabled.count == 0 &&
      staff_members.enabled.count == 0
  end
end
