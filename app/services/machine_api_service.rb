class MachineApiService
  class Result <  Struct.new(:machine, :success, :api_errors)
    def success?
      success
    end
  end

  def initialize(requester:, venue:)
    @requester = requester
    @venue = venue
    @ability = UserAbility.new(requester)
  end
  attr_reader :requester, :venue, :ability

  def create(params)
    machine = Machine.new(
      created_by_user: requester,
      venue: venue,
      name: params.fetch(:name),
      location: params.fetch(:location),
      float_cents: params.fetch(:float_cents),
      initial_refill_x_10p: params.fetch(:initial_refill_x_10p),
      initial_cash_in_x_10p: params.fetch(:initial_cash_in_x_10p),
      initial_cash_out_x_10p: params.fetch(:initial_cash_out_x_10p),
      initial_float_topup_cents: params.fetch(:initial_float_topup_cents),
    )

    result = machine.save

    api_errors = nil
    if !result
      api_errors = MachinesAppApiErrors.new(machine)
    end

    Result.new(machine, result, api_errors)
  end

  def update(params)
    machine = venue.machines.find(params.fetch(:id))
    result = machine.update_attributes({
      name: params.fetch(:name),
      location: params.fetch(:location)
    })
    api_errors = nil
    if !result
      api_errors = MachinesAppApiErrors.new(machine)
    end

    Result.new(machine, result, api_errors)
  end

  def destroy(params)
    machine = venue.machines.find(params.fetch(:id))
    result = machine.update_attributes({
      disabled_at: Time.now,
      disabled_by: requester
    })
    api_errors = nil
    if !result
      api_errors = MachinesAppApiErrors.new(machine)
    end

    Result.new(machine, result, api_errors)
  end

  def restore(params)
    machine = venue.machines.find(params.fetch(:id))
    result = machine.update_attributes({
      name: params.fetch(:name),
      location: params.fetch(:location),
      initial_refill_x_10p: params.fetch(:initial_refill_x_10p),
      initial_cash_in_x_10p: params.fetch(:initial_cash_in_x_10p),
      initial_cash_out_x_10p: params.fetch(:initial_cash_out_x_10p),
      disabled_at: nil,
      disabled_by: nil,
    })
    api_errors = nil
    if !result
      api_errors = MachinesAppApiErrors.new(machine)
    end

    Result.new(machine, result, api_errors)
  end
end
