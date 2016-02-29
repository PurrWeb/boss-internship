class PayRatesController < ApplicationController
  before_action :authorize_admin

  def index
    pay_rates = PayRate.named
    render locals: { pay_rates: pay_rates }
  end

  def new
    pay_rate = PayRate.new
    render locals: { pay_rate: pay_rate }
  end

  def create
    pay_rate = PayRate.new(pay_rate_params)

    if pay_rate.save
      flash[:success] = "Pay Rate added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this pay rate"
      render 'new', locals: { pay_rate: pay_rate }
    end
  end

  private
  def authorize_admin
    authorize! :manage, :admin
  end

  def pay_rate_params
    params.
      require(:pay_rate).
      permit(
        :name,
        :description
      ).merge(
        pay_rate_type: 'named',
        cents_per_hour: cents_per_hour_from_params
      )
  end

  def cents_per_hour_from_params
    if params['pay_rate']['hourly_rate'].present?
      (Float(params['pay_rate']['hourly_rate']) * 100).round
    else
      0
    end
  end
end
