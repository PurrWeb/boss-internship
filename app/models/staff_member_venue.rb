class StaffMemberVenue < ActiveRecord::Base
  belongs_to :staff_member, inverse_of: :staff_member_venues
  belongs_to :venue

  validates :venue, presence: true
  validates :staff_member, presence: true
end
