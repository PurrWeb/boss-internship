class Venue < ActiveRecord::Base
  belongs_to :creator, class_name: 'User'
  has_many :rotas, inverse_of: :venue
  has_many :users
  has_many :staff_member_venues
  has_many :master_staff_members, class_name: 'StaffMember', inverse_of: :master_venue, foreign_key: :master_venue_id
  has_many :other_staff_members, through: :staff_member_venues, source: :staff_member
  has_many :venue_reminder_users
  has_many :reminder_users, through: :venue_reminder_users, source: :user

  serialize :fruit_order_fields, Array

  validates :name, presence: true, uniqueness: true
  validates :creator, presence: true
  validate do |venue|
    if venue.fruit_order_fields - FruitOrder::FIELDS != []
      venue.errors.add(:fruit_order_fields, 'must be valid')
    end
  end
end
