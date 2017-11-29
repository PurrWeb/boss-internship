class Venue < ActiveRecord::Base
  # Associations
  belongs_to :creator, class_name: 'User'
  has_many :rotas, inverse_of: :venue
  has_many :machines
  has_many :machines_refloats, through: :machines
  has_many :incident_reports
  has_many :staff_member_venues
  has_many :master_staff_members, class_name: 'StaffMember', inverse_of: :master_venue, foreign_key: :master_venue_id
  has_many :other_staff_members, through: :staff_member_venues, source: :staff_member
  has_many :venue_reminder_users
  has_many :reminder_users, through: :venue_reminder_users, source: :user
  has_many :check_list_submissions
  has_many :check_lists
  has_many :maintenance_tasks
  has_and_belongs_to_many :questionnaires
  has_many :vouchers
  has_and_belongs_to_many :dashboard_messages

  before_create :generate_rollbar_guid
  before_validation :check_rollbar_guid
  after_initialize :set_latitude_and_longitude

  # Serializers
  serialize :fruit_order_fields, Array

  # Validations
  validates :rollbar_guid, presence: true
  validates :safe_float_cents,
    numericality: { greater_than_or_equal_to: 0 }
  validates :till_float_cents,
    numericality: { greater_than_or_equal_to: 0 }
  validates :latitude , numericality: { greater_than_or_equal_to:  -90, less_than_or_equal_to:  90 }
  validates :longitude, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }

  validates :name, presence: true, uniqueness: true
  validates :creator, presence: true
  validate do |venue|
    if venue.fruit_order_fields - FruitOrder::FIELDS != []
      venue.errors.add(:fruit_order_fields, 'must be valid')
    end
  end

  # Instance Methods
  [:till_float, :safe_float].each do |field_prefix|
    define_method "#{field_prefix}_pound_value" do
      Float(public_send("#{field_prefix}_cents") || 0.0) / 100.0
    end
  end

  private

  def set_latitude_and_longitude
    self.latitude = 0
    self.longitude = 0
  end

  def check_rollbar_guid
    unless rollbar_guid.present?
      generate_rollbar_guid
    end
  end

  def generate_rollbar_guid
    self.rollbar_guid = SecureRandom.uuid
  end
end
