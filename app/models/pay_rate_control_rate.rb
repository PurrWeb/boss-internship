class PayRateControlRate
  include ActionView::Helpers::NumberHelper

  def initialize(pay_rate)
    @pay_rate = pay_rate
  end

  def name
    "#{pay_rate.name} - #{number_to_currency(pay_rate.pounds_per_hour, unit: '£')}/Hour"
  end

  def id
    pay_rate.id
  end

  private
  attr_reader :pay_rate
end
