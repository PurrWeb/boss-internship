class Venue < ActiveRecord::Base
  has_many :users
  has_many :staff_member_venues
  has_many :staff_members, through: :staff_member_venues

  validates :name, presence: true, uniqueness: true
end
