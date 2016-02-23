class PayRate < ActiveRecord::Base
  TYPES = ['named']

  validates :pay_rate_type, inclusion: { in: TYPES, message: 'is invalid' }
  validates :cents_per_hour, numericality: { greater_than: 0 }

  #validate do |pay_rate|
  #  case pay_rate_type
  #  when 'named'
  #    NamedPayrateValidator.new(pay_rate).validate
  #  end
  #end

  def self.named
    where(pay_rate_type: 'named')
  end

  def pounds_per_hour
    if cents_per_hour.present?
      cents_per_hour / 100.0
    else
      0
    end
  end
end
