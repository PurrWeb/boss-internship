class PayRate < ActiveRecord::Base
  TYPES = ['named', 'admin']
  CALCULATION_TYPE = ['incremental_per_hour', 'salary_per_week']

  include ActionView::Helpers::NumberHelper
  include Enableable

  has_many :staff_members, inverse_of: :pay_rate
  validates :pay_rate_type, inclusion: { in: TYPES, message: 'is invalid' }
  validates :calculation_type, inclusion: { in: CALCULATION_TYPE, message: 'is invalid' }
  validates :cents, numericality: { greater_than: 0 }

  def self.named
    where(pay_rate_type: 'named')
  end

  def self.admin
    where(pay_rate_type: 'admin')
  end

  def self.options_for(user)
    if user.has_admin_access?
      pay_rate_options = PayRate.enabled
    else
      pay_rate_options = PayRate.enabled.named
    end
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

  def editable_by?(user)
    PayRate.options_for(user).include?(self)
  end

  def rate_in_pounds
    if cents.present?
      cents / 100.0
    else
      0
    end
  end

  def text_description
    result = "#{number_to_currency(rate_in_pounds, unit: '£')} "
    result = result + PayRate.calculation_type_per_message(calculation_type)
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
