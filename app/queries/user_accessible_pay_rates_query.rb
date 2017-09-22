class UserAccessiblePayRatesQuery
  def initialize(user:, pay_rate:)
    @user = user
    @pay_rate = pay_rate
  end

  def page_pay_rates
    accessible_pay_rates = PayRate.selectable_by(user)
    combined_pay_rates = accessible_pay_rates + [pay_rate]
    combined_pay_rates.uniq {|venue| venue.id }
  end

  private
  attr_reader :user, :pay_rate, :work_venues
end
