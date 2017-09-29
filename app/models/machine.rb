class Machine < ActiveRecord::Base
  belongs_to :user
  belongs_to :created_by_user, class_name: "User"
  belongs_to :venue
  has_many :machines_refloats
  belongs_to :disabled_by, class_name: "User"

  validates :venue, presence: true
  validates :name, presence: true
  validates :location, presence: true
  validates :float_cents, presence: true
  validates :initial_refill_x_10p, presence: true
  validates :initial_cash_in_x_10p, presence: true
  validates :initial_cash_out_x_10p, presence: true
  validates :initial_float_topup_cents, presence: true

  validate :disable_fields_correct
  validate :float_cents_positive
  validate :initial_refill_x_10p_positive
  validate :initial_cash_in_x_10p_positive
  validate :initial_cash_out_x_10p_positive
  
  def disable_fields_correct
    if disabled_at.present? ^ disabled_by.present?
      errors.add(:base, 'disabled user and time must both be present')
    end
  end
  
  def float_cents_positive
    if float_cents.present? && float_cents < 0
      errors.add(:float_cents, 'must be positive')
    end
  end

  def initial_refill_x_10p_positive
    if initial_refill_x_10p.present? && initial_refill_x_10p < 0
      errors.add(:initial_refill_x_10p, 'must be positive')
    end
  end

  def initial_cash_in_x_10p_positive
    if initial_cash_in_x_10p.present? && initial_cash_in_x_10p < 0
      errors.add(:initial_cash_in_x_10p, 'must be positive')
    end
  end

  def initial_cash_out_x_10p_positive
    if initial_cash_out_x_10p.present? && initial_cash_out_x_10p < 0
      errors.add(:initial_cash_out_x_10p, 'must be positive')
    end
  end

  def self.enabled
    where(disabled_at: nil)
  end
end
