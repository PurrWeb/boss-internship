class Venue < ActiveRecord::Base
  belongs_to :creator, class_name: 'User'
  has_many :rotas, inverse_of: :venue
  has_many :users
  has_many :staff_member_venues
  has_many :staff_members, through: :staff_member_venues

  validates :name, presence: true, uniqueness: true
  validates :creator, presence: true
end
