class PayRatesController < ApplicationController
  before_action :authorize_admin

  def index
    pay_rates = PayRate.named.enabled
    admin_pay_rates = PayRate.admin.enabled

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
      calculation_type: pay_rate_params.fetch(:calculation_type),
      cents: rate_to_cents(
        pay_rate_params.fetch(:rate)
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
      calculation_type: pay_rate_params.fetch(:calculation_type),
      cents: rate_to_cents(
        pay_rate_params.fetch(:rate)
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
    pay_rate = PayRate.enabled.where(id: params[:id]).take!
    render locals: { pay_rate: pay_rate }
  end

  def update
    pay_rate = PayRate.enabled.where(id: params[:id]).take!

    result = UpdatePayRate.new(
      pay_rate: pay_rate,
      name: pay_rate_params.fetch(:name),
      calculation_type: pay_rate_params.fetch(:calculation_type),
      cents: rate_to_cents(
        pay_rate_params.fetch(:rate)
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

  def destroy
    pay_rate = PayRate.enabled.where(id: params[:id]).take!

    if pay_rate.staff_members.enabled.count > 0
      flash[:success] = "Pay rates cannot be deleted while associated with active staff members"
      redirect_to action: :index
    else
      pay_rate.disable!
      flash[:success] = "Pay Rate deleted successfully"
      redirect_to action: :index
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
        :calculation_type,
        :rate
      )
  end

  def rate_to_cents(rate)
    (Float(rate) * 100).round
  end
end
