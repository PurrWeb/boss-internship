class PayRateControlRate
  include ActionView::Helpers::NumberHelper

  def initialize(pay_rate:, user:)
    @user = user
    @pay_rate = pay_rate
  end

  def name
    if !pay_rate.editable_by?(user)
      pay_rate.name
    elsif pay_rate.admin?
      "Admin | #{pay_rate.name} (#{number_to_currency(pay_rate.pounds_per_hour, unit: '£')}/Hour)"
    else
      "#{pay_rate.name} (#{number_to_currency(pay_rate.pounds_per_hour, unit: '£')}/Hour)"
    end
  end

  def id
    pay_rate.id
  end

  private
  attr_reader :pay_rate, :user
end
