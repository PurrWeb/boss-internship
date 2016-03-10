class PayRatesController < ApplicationController
  before_action :authorize_admin

  def index
    pay_rates = PayRate.named
    admin_pay_rates = PayRate.admin

    render locals: {
      pay_rates: pay_rates,
      admin_pay_rates: admin_pay_rates
    }
  end

  def new
    pay_rate = PayRate.new
    render locals: { pay_rate: pay_rate }
  end

  def create
    pay_rate = PayRate.new(
      pay_rate_type: 'named',
      name: pay_rate_params.fetch(:name),
      cents_per_hour: hourly_rate_to_cents_per_hour(
        pay_rate_params.fetch(:hourly_rate)
      )
    )

    if pay_rate.save
      flash[:success] = "Pay Rate added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this pay rate"
      render 'new', locals: { pay_rate: pay_rate }
    end
  end

  def create_admin
    pay_rate = PayRate.new(
      pay_rate_type: 'admin',
      name: pay_rate_params.fetch(:name),
      cents_per_hour: hourly_rate_to_cents_per_hour(
        pay_rate_params.fetch(:hourly_rate)
      )
    )

    if pay_rate.save
      flash[:success] = "Pay Rate added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this pay rate"
      render 'new', locals: { pay_rate: pay_rate }
    end
  end

  def edit
    pay_rate = PayRate.find(params[:id])
    render locals: { pay_rate: pay_rate }
  end

  def update
    pay_rate = PayRate.find(params[:id])

    result = UpdatePayRate.new(
      pay_rate: pay_rate,
      name: pay_rate_params.fetch(:name),
      cents_per_hour: hourly_rate_to_cents_per_hour(
        pay_rate_params.fetch(:hourly_rate)
      )
    ).call

    if result.success?
      flash[:success] = "Pay Rate updated successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem updating this pay rate"
      render 'edit', locals: { pay_rate: result.pay_rate }
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
        :hourly_rate
      )
  end

  def hourly_rate_to_cents_per_hour(hourly_rate)
    (Float(hourly_rate) * 100).round
  end
end
