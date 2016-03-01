class PayRate < ActiveRecord::Base
  TYPES = ['named', 'admin']

  validates :pay_rate_type, inclusion: { in: TYPES, message: 'is invalid' }
  validates :cents_per_hour, numericality: { greater_than: 0 }

  def self.named
    where(pay_rate_type: 'named')
  end

  def self.admin
    where(pay_rate_type: 'admin')
  end

  def self.options_for(user)
    if user.has_admin_access?
      pay_rate_options = PayRate.all
    else
      pay_rate_options = PayRate.named.all
    end
  end

  def admin?
    pay_rate_type == 'admin'
  end

  def editable_by?(user)
    PayRate.options_for(user).include?(self)
  end

  def pounds_per_hour
    if cents_per_hour.present?
      cents_per_hour / 100.0
    else
      0
    end
  end
end
