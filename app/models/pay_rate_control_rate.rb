class PayRateControlRate
  include ActionView::Helpers::NumberHelper

  def initialize(pay_rate:, user:)
    @user = user
    @pay_rate = pay_rate
  end

  def name
    if !pay_rate.editable_by?(user)
      pay_rate.name
    else
      result = ""
      if pay_rate.admin?
        result = result + "Admin | "
      end
      result = result + pay_rate.name.to_s
      result = result + " ("
      result = result + pay_rate.text_description
      result = result + ")"
      result
    end
  end

  def id
    pay_rate.id
  end

  private
  attr_reader :pay_rate, :user
end
