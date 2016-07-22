class RotaForecast < ActiveRecord::Base
  belongs_to :rota

  validates :forecasted_take_cents, presence: true
  validates :total_cents, presence: true
  validates :overhead_total_cents, presence: true
  validates :staff_total_cents, presence: true
  validates :pr_total_cents, presence: true
  validates :kitchen_total_cents, presence: true
  validates :security_total_cents, presence: true

  def venue
    rota.venue
  end

  def date
    rota.date
  end

  [:forecasted_take, :total, :overhead_total, :staff_total, :pr_total, :kitchen_total, :security_total].each do |money_attribute|
    define_method("#{money_attribute}") do
      cents = public_send("#{money_attribute}_cents")
      if cents.present?
        cents == 0 ? 0 : cents / 100.0
      end
    end
  end

  [:total, :overhead_total, :staff_total, :pr_total, :kitchen_total, :security_total].each do |total_method|
    define_method("#{total_method}_percentage") do
      if forecasted_take.present? && forecasted_take > 0.0
        public_send(total_method) / forecasted_take * 100
      end
    end
  end
end
