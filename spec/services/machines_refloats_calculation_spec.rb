require 'rails_helper'

RSpec.describe 'Machines refloat calculation' do

  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:machine) { FactoryGirl.create(
    :machine,
    venue: venue,
    created_by_user: user,
    disabled_by: nil,
    float_cents: 40000,
    initial_refill_x_10p: 0,
    initial_cash_in_x_10p: 0,
    initial_cash_out_x_10p: 0
  ) }

  let(:new_machines_refloat) { FactoryGirl.create(
    :machines_refloat,
    machine: machine,
    user: user,
  )}
  
  let(:service) do
    MachinesRefloatsCalculationService.new(
      machines_refloat: new_machines_refloat,
    )
  end

  it 'calculated_float_topup_cents should be succeed' do
    expect(service.calculated_float_topup_cents).to eq(new_machines_refloat.calculated_float_topup_cents)
  end

  it 'calculated_money_banked_cents should be succeed' do
    expect(service.calculated_money_banked_cents).to eq(new_machines_refloat.calculated_money_banked_cents)
  end
end
