class MachinesRefloatsApiService
  class Result <  Struct.new(:machine_refloat, :success, :api_errors)
    def success?
      success
    end
  end

  def initialize(requester:, machine:)
    @requester = requester
    @machine = machine
    @ability = Ability.new(requester)
  end
  attr_reader :requester, :machine, :ability

  def create(params)
    # ability.authorize! :manage, venue
    machines_refloat = MachinesRefloat.new(
      user: requester,
      machine: machine,
      refill_x_10p: params.fetch(:refill_x_10p),
      cash_in_x_10p: params.fetch(:cash_in_x_10p),
      cash_out_x_10p: params.fetch(:cash_out_x_10p),
      calculated_float_topup_cents: params.fetch(:calculated_float_topup_cents),
      float_topup_cents: params.fetch(:float_topup_cents),
      float_topup_note: params.fetch(:float_topup_note),
      calculated_money_banked_cents: params.fetch(:calculated_money_banked_cents),
      money_banked_cents: params.fetch(:money_banked_cents),
      money_banked_note: params.fetch(:money_banked_note)
    )

    result = machines_refloat.save

    api_errors = nil
    if !result
      api_errors = MachinesRefloatsApiErrors.new(machines_refloat)
    end

    Result.new(machines_refloat, result, api_errors)
  end
end
