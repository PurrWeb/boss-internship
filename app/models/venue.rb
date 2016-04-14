class Venue < ActiveRecord::Base
  belongs_to :creator, class_name: 'User'
  has_many :rotas, inverse_of: :venue
  has_many :users
  has_many :staff_member_venues
  has_many :staff_members, through: :staff_member_venues
  serialize :fruit_order_fields, Array

  validates :name, presence: true, uniqueness: true
  validates :creator, presence: true
  validate do |venue|
    if venue.fruit_order_fields - FruitOrder::FIELDS != []
      venue.errors.add(:fruit_order_fields, 'must be valid')
    end
  end
end
