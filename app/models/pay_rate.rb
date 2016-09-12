class PayRate < ActiveRecord::Base
  TYPES = ['named', 'admin']
  HOURLY_CALCULATION_TYPE = 'incremental_per_hour'
  WEEKLY_CALCULATION_TYPE = 'salary_per_week'
  CALCULATION_TYPES = [HOURLY_CALCULATION_TYPE, WEEKLY_CALCULATION_TYPE]

  include ActionView::Helpers::NumberHelper
  include Enableable

  has_many :staff_members, inverse_of: :pay_rate
  validates :pay_rate_type, inclusion: { in: TYPES, message: 'is invalid' }
  validates :calculation_type, inclusion: { in: CALCULATION_TYPES, message: 'is invalid' }
  validates :cents, numericality: { greater_than: 0 }

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
    if user.has_admin_access?
      pay_rate_options = PayRate.enabled
    else
      pay_rate_options = PayRate.enabled.named
    end
  end

  def self.is_18_to_21
    where(name: "Age 18-21")
  end

  def self.is_21_to_25
    where(name: "Age 21-25")
  end

  def self.is_25_plus
    where(name: "Age 25+")
  end

  def hourly?
    calculation_type == 'incremental_per_hour'
  end

  def weekly?
    calculation_type == 'salary_per_week'
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
    user.has_admin_access?
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
