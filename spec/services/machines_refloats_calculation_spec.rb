require 'rails_helper'

RSpec.describe 'Machines refloat calculation' do
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:venue) { FactoryGirl.create(:venue) }
  # £400
  let(:machine_float_cents) { 40000 }
  # £200
  let(:initial_refill_reading) { 2000 }
  # £400
  let(:initial_cash_in_reading) { 4000 }
  # £200
  let(:initial_cash_out_reading) { 2000 }

  describe 'for machine with zero initial readings' do
    let(:machine) do
      FactoryGirl.create(
        :machine,
        venue: venue,
        created_by_user: user,
        float_cents: machine_float_cents,
        initial_refill_x_10p: initial_refill_reading,
        initial_cash_in_x_10p: initial_cash_in_reading,
        initial_cash_out_x_10p: initial_cash_out_reading,
        initial_float_topup_cents: 0
      )
    end

    let(:service) do
      MachinesRefloatsCalculationService.new(
        machines_refloat: new_machine_refloat,
      )
    end

    context 'initial refloat' do
      context 'readings have not changed' do
        let(:new_machine_refloat) do
          FactoryGirl.build(
            :machines_refloat,
            refill_x_10p: initial_refill_reading,
            cash_in_x_10p: initial_cash_in_reading,
            cash_out_x_10p: initial_cash_out_reading,
            float_topup_cents: 0,
            money_banked_cents: 0,
            machine: machine,
            user: user
          )
        end

        specify 'calculated_float_topup_cents should be 0' do
          expect(service.calculated_float_topup_cents).to eq(0)
        end

        specify 'calculated_money_banked_cents should be 0' do
          expect(service.calculated_money_banked_cents).to eq(0)
        end
      end

      context 'readings have changed' do
        # £300 (+£100)
        let(:new_refill_reading) { initial_refill_reading + 1000 }
        # £600 (+£200)
        let(:new_cash_out_reading) { initial_cash_out_reading  + 2000}
        # £1000 (+£600)
        let(:new_cash_in_reading) { initial_cash_in_reading + 6000 }

        let(:new_machine_refloat) do
          FactoryGirl.build(
            :machines_refloat,
            refill_x_10p: new_refill_reading,
            cash_in_x_10p: new_cash_in_reading,
            cash_out_x_10p: new_cash_out_reading,
            float_topup_cents: 0,
            money_banked_cents: 0,
            machine: machine.reload,
            user: user
          )
        end

        let(:expected_float_topup_pounds) { 100 }
        let(:expected_money_banked_pounds) { 500 }

        specify 'calculated_float_topup_cents should be £100' do
          expect(service.calculated_float_topup_cents).to eq(expected_float_topup_pounds * 100)
        end

        specify 'calculated_money_banked_cents should be £500' do
          expect(service.calculated_money_banked_cents).to eq(expected_money_banked_pounds * 100)
        end
      end
    end

    context 'after multiple reading where numbers didnt work' do
      let(:refloat_1) do
        FactoryGirl.create(
          :machines_refloat,
          # £400 (+£200)
          refill_x_10p: initial_refill_reading + 2000,
          # £1000 (+£600)
          cash_in_x_10p: initial_cash_in_reading + 6000,
          # £500 (+£300)
          cash_out_x_10p: initial_cash_out_reading + 3000,
          # £100
          float_topup_cents: 10000,
          # £400
          money_banked_cents: 40000,
          machine: machine,
          user: user
        )
      end
      let(:refloat_2_base_refill_reading) do
        # if nothing changes the next refill reading will this, because the
        # topup adds to it
        refloat_1.refill_x_10p + (refloat_1.float_topup_cents / 10)
      end
      let(:refloat_2) do
        FactoryGirl.create(
          :machines_refloat,
          # £700 (+£300)
          refill_x_10p: refloat_2_base_refill_reading + 3000,
          # £2000 (+£1000)
          cash_in_x_10p: refloat_1.cash_in_x_10p + 10000,
          # £1000 (+£500)
          cash_out_x_10p: refloat_1.cash_out_x_10p + 5000,
          # £100 (-100)
          float_topup_cents: 10000,
          float_topup_note: 'Not enough money',
          # £500 (-£200)
          money_banked_cents: 50000,
          money_banked_note: 'Not enough money',
          machine: machine,
          user: user
        )
      end
      let(:refloat_3_base_refill_reading) do
        # if nothing changes the next refill reading will this, because the
        # topup adds to it
        refloat_2.refill_x_10p + (refloat_2.float_topup_cents / 10)
      end
      let(:create_refloats) do
        refloat_1
        refloat_2
      end

      let(:new_machine_refloat) do
        FactoryGirl.build(
          :machines_refloat,
          refill_x_10p: refloat_3_base_refill_reading,
          cash_in_x_10p: refloat_2.cash_in_x_10p,
          cash_out_x_10p: refloat_2.cash_out_x_10p,
          float_topup_cents: 0,
          money_banked_cents: 0,
          machine: machine.reload,
          user: user
        )
      end

      # untopped up from refloat 2
      let(:expected_float_topup_pounds) { 100 }
      # unbanked from refloat 2
      let(:expected_money_banked_pounds) { 200 }

      before do
        create_refloats
      end

      specify 'calculated_float_topup_cents should be untopped up from previous' do
        expect(service.calculated_float_topup_cents).to eq(expected_float_topup_pounds * 100)
      end

      specify 'calculated_money_banked_cents should be unbanked from previous' do
        expect(service.calculated_money_banked_cents).to eq(expected_money_banked_pounds * 100)
      end
    end
  end
end
