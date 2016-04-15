require 'rails_helper'

RSpec.describe GenerateRotaForecast do
  let(:week) { RotaWeek.new(Time.zone.now + 1.week) }
  let(:rota_shift_date) { RotaShiftDate.new(week.start_date) }
  let(:forecasted_take) { Money.new(0) }
  let(:service) do
    GenerateRotaForecast.new(
      forecasted_take: forecasted_take,
      rota: rota
    )
  end
  let(:result) { service.call }
  let(:rota) do
    FactoryGirl.create(
      :rota,
      date: week.start_date
    )
  end

  describe 'totals' do
    context 'no staff_members exist' do
      specify 'total should be 0' do
        expect(result.total).to eq(Money.new(0))
      end

      specify 'category totals should all be 0' do
        category_total_methods.each do |total_method|
          expect(result.public_send(total_method)).to eq(Money.new(0))
        end
      end
    end

    context 'a default staff member exists with a shift on the rota' do
      let(:pay_rate) { FactoryGirl.create(:pay_rate, cents_per_hour: 1500) }
      let(:staff_type) { FactoryGirl.create(:staff_type) }
      let!(:staff_member) do
        FactoryGirl.create(
          :staff_member,
          pay_rate: pay_rate,
          staff_type: staff_type
        )
      end
      let!(:rota_shift) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member,
          rota: rota,
          starts_at: rota_shift_date.start_time ,
          ends_at: rota_shift_date.start_time + 2.hours
        )
      end

      specify 'staffs hours should show up in total' do
        expect(result.total).to eq(Money.from_amount(30))
      end

      specify 'staffs hours should show up in staff_total' do
          expect(result.staff_total).to eq(Money.from_amount(30))
      end

      specify 'staffs hours should not show up in other totals' do
        (category_total_methods - [:staff_total]).each do |total_method|
          expect(result.public_send(total_method)).to eq(Money.new(0))
        end
      end
    end

    context 'a pr exists with a shift on the rota' do
      let(:pay_rate) { FactoryGirl.create(:pay_rate, cents_per_hour: 1500) }
      let(:pr_staff_type) { FactoryGirl.create(:pr_staff_type) }
      let!(:staff_member) do
        FactoryGirl.create(
          :staff_member,
          pay_rate: pay_rate,
          staff_type: pr_staff_type
        )
      end
      let!(:rota_shift) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member,
          rota: rota,
          starts_at: rota_shift_date.start_time ,
          ends_at: rota_shift_date.start_time + 2.hours
        )
      end

      specify 'prs hours should show up in total' do
        expect(result.total).to eq(Money.from_amount(30))
      end

      specify 'prs hours should show up in pr_total' do
          expect(result.pr_total).to eq(Money.from_amount(30))
      end

      specify 'prs hours should not show up in other totals' do
        (category_total_methods - [:pr_total]).each do |total_method|
          expect(result.public_send(total_method)).to eq(Money.new(0))
        end
      end
    end

    context 'a member of kitchen staff exists with a shift on the rota' do
      let(:pay_rate) { FactoryGirl.create(:pay_rate, cents_per_hour: 1500) }
      let(:kitchen_staff_type) { FactoryGirl.create(:kitchen_staff_type) }
      let!(:staff_member) do
        FactoryGirl.create(
          :staff_member,
          pay_rate: pay_rate,
          staff_type: kitchen_staff_type
        )
      end
      let!(:rota_shift) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member,
          rota: rota,
          starts_at: rota_shift_date.start_time ,
          ends_at: rota_shift_date.start_time + 2.hours
        )
      end

      specify 'kitchen_staffs hours should show up in total' do
        expect(result.total).to eq(Money.from_amount(30))
      end

      specify 'kitchen_staffs hours should show up in kitchen staffs total' do
          expect(result.kitchen_total).to eq(Money.from_amount(30))
      end

      specify 'kitchen_staffs hours should not show up in other totals' do
        (category_total_methods - [:kitchen_total]).each do |total_method|
          expect(result.public_send(total_method)).to eq(Money.new(0))
        end
      end
    end

    context 'a member of security staff exists with a shift on the rota' do
      let(:pay_rate) { FactoryGirl.create(:pay_rate, cents_per_hour: 1500) }
      let!(:staff_member) do
        FactoryGirl.create(
          :staff_member,
          :security,
          pay_rate: pay_rate,
        )
      end
      let!(:rota_shift) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member,
          rota: rota,
          starts_at: rota_shift_date.start_time ,
          ends_at: rota_shift_date.start_time + 2.hours
        )
      end

      specify 'security staffs hours should show up in total' do
        expect(result.total).to eq(Money.from_amount(30))
      end

      specify 'security staffs hours should show up in security staffs total' do
          expect(result.security_total).to eq(Money.from_amount(30))
      end

      specify 'security_staffs hours should not show up in other totals' do
        (category_total_methods - [:security_total]).each do |total_method|
          expect(result.public_send(total_method)).to eq(Money.new(0))
        end
      end
    end
  end

  def category_total_methods
    [:staff_total, :pr_total, :kitchen_total, :security_total]
  end
end
