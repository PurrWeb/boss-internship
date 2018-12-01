class Venue < ActiveRecord::Base
  VENUE_TYPE = "normal".freeze
  ROTA_THRESHOLD_FIELDS = [:overheads_threshold_percentage, :staff_threshold_percentage, :pr_threshold_percentage, :kitchen_threshold_percentage, :security_threshold_percentage]

  # Associations
  belongs_to :creator, class_name: 'User'
  has_one :api_key
  has_many :rotas, inverse_of: :venue
  has_many :machines
  has_many :machines_refloats, through: :machines
  has_many :incident_reports
  has_many :staff_member_venues
  has_many :master_staff_members, class_name: 'StaffMember', inverse_of: :master_venue, foreign_key: :master_venue_id
  has_many :other_staff_members, through: :staff_member_venues, source: :staff_member
  has_many :check_list_submissions
  has_many :check_lists
  has_many :maintenance_tasks
  has_and_belongs_to_many :questionnaires
  has_many :vouchers
  has_and_belongs_to_many :dashboard_messages
  has_many :accessories
  has_many :ops_diaries
  has_many :security_shift_requests
  has_many :finance_reports

  before_create :generate_rollbar_guid
  before_validation :check_rollbar_guid

  # Serializers
  serialize :fruit_order_fields, Array

  # Validations
  validates :rollbar_guid, presence: true

  validates :overheads_threshold_percentage, numericality: { greater_than: 0.0 }, allow_nil: true
  validates :staff_threshold_percentage, numericality: { greater_than: 0.0 }, allow_nil: true
  validates :pr_threshold_percentage, numericality: { greater_than: 0.0 }, allow_nil: true
  validates :kitchen_threshold_percentage, numericality: { greater_than: 0.0 }, allow_nil: true
  validates :security_threshold_percentage, numericality: { greater_than: 0.0 }, allow_nil: true
  validates :safe_float_cents,
    numericality: { greater_than_or_equal_to: 0 }
  validates :till_float_cents,
    numericality: { greater_than_or_equal_to: 0 }
  validates :latitude , numericality: { greater_than_or_equal_to:  -90, less_than_or_equal_to:  90 }
  validates :longitude, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }

  validates :name, presence: true, uniqueness: true
  validates :latitude, :longitude, presence: true
  validates :creator, presence: true
  validate do |venue|
    if venue.fruit_order_fields - FruitOrder::FIELDS != []
      venue.errors.add(:fruit_order_fields, 'must be valid')
    end
  end

  auto_strip_attributes :change_order_site_id, delete_whitespaces: true

  # Instance Methods
  [:till_float, :safe_float].each do |field_prefix|
    define_method "#{field_prefix}_pound_value" do
      Float(public_send("#{field_prefix}_cents") || 0.0) / 100.0
    end
  end

  def venue_type
    VENUE_TYPE
  end

  private

  def check_rollbar_guid
    unless rollbar_guid.present?
      generate_rollbar_guid
    end
  end

  def generate_rollbar_guid
    self.rollbar_guid = SecureRandom.uuid
  end
end
