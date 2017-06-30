class Venue < ActiveRecord::Base
  belongs_to :creator, class_name: 'User'
  has_many :rotas, inverse_of: :venue
  has_many :users
  has_many :staff_member_venues
  has_many :master_staff_members, class_name: 'StaffMember', inverse_of: :master_venue, foreign_key: :master_venue_id
  has_many :other_staff_members, through: :staff_member_venues, source: :staff_member
  has_many :venue_reminder_users
  has_many :reminder_users, through: :venue_reminder_users, source: :user

  before_create :generate_rollbar_guid

  serialize :fruit_order_fields, Array
  validates :safe_float_cents,
    numericality: { greater_than_or_equal_to: 0 }
  validates :till_float_cents,
    numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, uniqueness: true
  validates :creator, presence: true
  validate do |venue|
    if venue.fruit_order_fields - FruitOrder::FIELDS != []
      venue.errors.add(:fruit_order_fields, 'must be valid')
    end
  end

  [:till_float, :safe_float].each do |field_prefix|
    define_method "#{field_prefix}_pound_value" do
      Float(public_send("#{field_prefix}_cents") || 0.0) / 100.0
    end
  end

  private
  def generate_rollbar_guid
    self.rollbar_guid = SecureRandom.uuid
  end
end
