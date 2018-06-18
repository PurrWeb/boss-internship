class PayRate < ActiveRecord::Base
  TYPES = ['named', 'admin']
  HOURLY_CALCULATION_TYPE = 'incremental_per_hour'
  WEEKLY_CALCULATION_TYPE = 'salary_per_week'
  CALCULATION_TYPES = [HOURLY_CALCULATION_TYPE, WEEKLY_CALCULATION_TYPE]

  NAME_18_TO_20_ENDING = "18-20"
  NAME_21_TO_24_ENDING = "21-24"
  NAME_25_PLUS_ENDING  = "25+"

  NORMAL_18_20_PAY_RATE = 'Age 18-20'
  NORMAL_21_24_PAY_RATE = 'Age 21-24'
  NORMAL_25_PLUS_PAY_RATE = 'Age 25+'

  BAR_SUPERVISOR_PAY_RATE = 'Bar Supervisor'
  BAR_SUPERVISOR_25_PLUS_PAY_RATE = 'Bar Supervisor 25+'

  BOLTON_LEVEL_18_20_PAY_RATE = 'Bolton - Level - 18-20'
  BOLTON_LEVEL_21_24_PAY_RATE = 'Bolton - Level - 21-24'
  BOLTON_LEVEL_25_PLUS_PAY_RATE = 'Bolton - Level - 25+'

  AGED_PAYRATE_NAMES = [
    NORMAL_18_20_PAY_RATE,
    NORMAL_21_24_PAY_RATE,
    NORMAL_25_PLUS_PAY_RATE,
    BAR_SUPERVISOR_PAY_RATE,
    BAR_SUPERVISOR_25_PLUS_PAY_RATE,
    BOLTON_LEVEL_18_20_PAY_RATE,
    BOLTON_LEVEL_21_24_PAY_RATE,
    BOLTON_LEVEL_25_PLUS_PAY_RATE
  ]

  PAY_RATE_GROUPS = {
    normal: [
      PayRate::NORMAL_18_20_PAY_RATE,
      PayRate::NORMAL_21_24_PAY_RATE,
      PayRate::NORMAL_25_PLUS_PAY_RATE
    ],
    bar_supervisor: [
      PayRate::BAR_SUPERVISOR_PAY_RATE,
      PayRate::BAR_SUPERVISOR_25_PLUS_PAY_RATE
    ],
    bolton: [
      PayRate::BOLTON_LEVEL_18_20_PAY_RATE,
      PayRate::BOLTON_LEVEL_21_24_PAY_RATE,
      PayRate::BOLTON_LEVEL_25_PLUS_PAY_RATE
    ]
  }

  include ActionView::Helpers::NumberHelper
  include Enableable

  has_many :staff_members, inverse_of: :pay_rate
  validates :pay_rate_type, inclusion: { in: TYPES, message: 'is invalid' }
  validates :calculation_type, inclusion: { in: CALCULATION_TYPES, message: 'is invalid' }
  validates :cents, numericality: { greater_than: 0 }

  scope :aged_pay_rates, -> {where(name: AGED_PAYRATE_NAMES)}

  def self.named
    where(pay_rate_type: 'named')
  end

  def self.admin
    where(pay_rate_type: 'admin')
  end

  def self.weekly
    where(calculation_type: WEEKLY_CALCULATION_TYPE)
  end

  def self.selectable_by(user)
    ability = UserAbility.new(user)

    if ability.can?(:create_admin, :pay_rate)
      pay_rate_options = PayRate.enabled
    else
      pay_rate_options = PayRate.enabled.named
    end
  end

  def self.is_18_to_20
    where("TRIM(`name`) LIKE '%#{NAME_18_TO_20_ENDING}'")
  end

  def self.is_21_to_24
    where("TRIM(`name`) LIKE '%#{NAME_21_TO_24_ENDING}'")
  end

  def self.is_25_plus
    where("TRIM(`name`) LIKE '%#{NAME_25_PLUS_ENDING}'")
  end

  def is_18_to_20?
    /#{NAME_18_TO_20_ENDING}$/.match(name.strip)
  end

  def is_21_to_24?
    /#{NAME_21_TO_24_ENDING}$/.match(name.strip)
  end

  def is_25_plus?
    /#{NAME_25_PLUS_ENDING}$/.match(name.strip)
  end

  def aged?
    is_18_to_20? ||
      is_21_to_24? ||
      is_25_plus?
  end

  def hourly?
    calculation_type == HOURLY_CALCULATION_TYPE
  end

  def weekly?
    calculation_type == WEEKLY_CALCULATION_TYPE
  end

  def deletable?
    staff_members.enabled.count == 0
  end

  def disable!
    update_attributes!(enabled: false)
  end

  def admin?
    pay_rate_type == 'admin'
  end

  def selectable_by?(user)
    PayRate.selectable_by(user).include?(self)
  end

  def editable_by?(user)
    user.has_effective_access_level?(AccessLevel.admin_access_level)
  end

  def rate_in_pounds
    if cents.present?
      cents / 100.0
    else
      0
    end
  end

  def type_description
    case calculation_type
    when 'incremental_per_hour'
      "Hourly"
    when 'salary_per_week'
      'Weekly'
    else
      raise ArgumentError, "unsupported calculation_type #{calculation_type}"
    end
  end

  def text_description
    result = "#{number_to_currency(rate_in_pounds, unit: '£')} "
    result = result + PayRate.calculation_type_per_message(calculation_type)
    result
  end

  def text_description_short
    result = "#{number_to_currency(rate_in_pounds, unit: '£')}"
    result = result + PayRate.calculation_type_per_message_short(calculation_type)
    result
  end

  def self.calculation_type_per_message(calculation_type)
    case calculation_type
    when 'incremental_per_hour'
      'Per Hour'
    when 'salary_per_week'
      'Per Week'
    else
      raise ArgumentError, "invalid calculation_type #{calculation_type} supplied"
    end
  end

  def self.calculation_type_per_message_short(calculation_type)
    case calculation_type
    when 'incremental_per_hour'
      '/h'
    when 'salary_per_week'
      '/Wk'
    else
      raise ArgumentError, "invalid calculation_type #{calculation_type} supplied"
    end
  end

  def self.calculation_type_display_name(calculation_type)
    case calculation_type
    when 'incremental_per_hour'
      "Incremental #{calculation_type_per_message(calculation_type)}"
    when 'salary_per_week'
      "Salary #{calculation_type_per_message(calculation_type)}"
    else
      raise ArgumentError, "invalid calculation_type #{calculation_type} supplied"
    end
  end
end
