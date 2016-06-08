class AdminPayRatesController < ApplicationController
  before_action :authorize_admin

  def new
    pay_rate = PayRate.new
    render locals: { pay_rate: pay_rate }
  end

  def create
    pay_rate = PayRate.new(pay_rate_params)

    if pay_rate.save
      flash[:success] = "Pay Rate added successfully"
      redirect_to pay_rates_path
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
        pay_rate_type: 'admin',
        cents: cents_from_params
      )
  end

  def cents_from_params
    if params['pay_rate']['hourly_rate'].present?
      (Float(params['pay_rate']['hourly_rate']) * 100).round
    else
      0
    end
  end
end
