class StaffMemberVenue < ActiveRecord::Base
  belongs_to :staff_member, inverse_of: :staff_member_venue
  belongs_to :venue
  after_initialize :init

  validates :venue, presence: true
  validates :staff_member, presence: true

  def init
    if self.enabled.nil?
      self.enabled = true
    end
  end
end
