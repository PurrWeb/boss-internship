class UpdatePayRate
  class Result < Struct.new(:success, :pay_rate)
    def success?
      success
    end
  end

  def initialize(pay_rate:, name:, calculation_type:, cents:)
    @pay_rate = pay_rate
    @name = name
    @calculation_type = calculation_type
    @cents = cents
  end

  def call
    result = false

    pay_rate.assign_attributes(
      name: name,
      calculation_type: calculation_type,
      cents: cents
    )
    pay_rate_changed = pay_rate.cents_changed? || pay_rate.calculation_type_changed?

    ActiveRecord::Base.transaction do
      result = pay_rate.save

      if result && pay_rate_changed
        update_related_forecasts(pay_rate)
      end
    end

    Result.new(result, pay_rate)
  end

  private
  attr_reader :pay_rate, :name, :calculation_type, :cents

  def update_related_forecasts(pay_rate)
    pay_rate_staff_members = StaffMember.where(pay_rate: pay_rate)

    rotas = CurrentAndFutureRotasQuery.new(relation: Rota.with_forecasts).all.
      joins(:rota_shifts).
      merge(
        RotaShift.
        enabled.
        joins(:staff_member).
        merge(
          pay_rate_staff_members
        )
      )

    rotas.each do |rota|
      UpdateRotaForecast.new(rota: rota).call
    end
  end
end
