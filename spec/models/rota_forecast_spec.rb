require 'rails_helper'

RSpec.describe RotaForecast do
  let(:week) { RotaWeek.new(RotaShiftDate.to_rota_date(Time.zone.now + 1.week)) }
  let(:rota_shift_date) { RotaShiftDate.new(week.start_date) }
  let(:rota) do
    FactoryGirl.create(
      :rota,
      date: week.start_date
    )
  end
  let(:forecasted_take_cents) { 1000000 }
  let(:total_cents) { 0 }
  let(:overhead_total_cents) { 0 }
  let(:staff_total_cents) { 0 }
  let(:pr_total_cents) { 0 }
  let(:kitchen_total_cents) { 0 }
  let(:security_total_cents) { 0 }
  let(:forecast) do
    RotaForecast.new(
      rota: rota,
      forecasted_take_cents: forecasted_take_cents,
      total_cents: total_cents,
      overhead_total_cents: overhead_total_cents,
      staff_total_cents: staff_total_cents,
      pr_total_cents: pr_total_cents,
      kitchen_total_cents: kitchen_total_cents,
      security_total_cents: security_total_cents
    )
  end

  describe "percentages" do
    context 'forecasted_take is 0' do
      let(:forecasted_take_cents) { 0 }

      specify 'all percentages should be nil' do
        expect(forecast.total_percentage).to eq(nil)
        category_percentage_methods.each do |total_method|
          expect(forecast.public_send(total_method)).to eq(nil)
        end
      end
    end

    context 'no staff members have hours' do
      specify 'all percentages should be 0' do
        expect(forecast.total_percentage).to eq(0)
        category_percentage_methods.each do |total_method|
          expect(forecast.public_send(total_method)).to eq(0)
        end
      end
    end

    context 'staff member total is non zero' do
      let(:staff_total_cents) { 100000 }

      specify 'should contribute to staff category percentage' do
        expect(forecast.staff_total_percentage).to eq(10)
      end

      specify 'should not contribute to other percenatages' do
        (category_percentage_methods - [:staff_total_percentage]).each do |total_method|
          expect(forecast.public_send(total_method)).to eq(0)
        end
      end
    end

    context 'pr total is non zero' do
      let(:pr_total_cents) { 100000 }

      specify 'should contribute to pr category percentage' do
        expect(forecast.pr_total_percentage).to eq(10)
      end

      specify 'should not contribute to other percenatages' do
        (category_percentage_methods - [:pr_total_percentage]).each do |total_method|
          expect(forecast.public_send(total_method)).to eq(0)
        end
      end
    end

    context 'kitchen staff member has hours' do
      let(:kitchen_total_cents) { 100000 }

      specify 'should contribute to kitchen category percentage' do
        expect(forecast.kitchen_total_percentage).to eq(10)
      end

      specify 'should not contribute to other percenatages' do
        (category_percentage_methods - [:kitchen_total_percentage]).each do |total_method|
          expect(forecast.public_send(total_method)).to eq(0)
        end
      end
    end

    context 'security staff member has hours' do
      let(:security_total_cents) { 100000 }

      specify 'should contribute to security category percentage' do
        expect(forecast.security_total_percentage).to eq(10)
      end

      specify 'should not contribute to other percenatages' do
        (category_percentage_methods - [:security_total_percentage]).each do |total_method|
          expect(forecast.public_send(total_method)).to eq(0)
        end
      end
    end
  end

  def category_percentage_methods
    [
      :staff_total_percentage,
      :overhead_total_percentage,
      :pr_total_percentage,
      :kitchen_total_percentage,
      :security_total_percentage
    ]
  end
end
