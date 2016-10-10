require 'rails_helper'

describe PayRate do
  describe "PayRate#is_18_to_20" do
    let(:existing_pay_rate) { FactoryGirl.create(:pay_rate, name: name) }

    describe 'pay rate exists' do
      before do
        existing_pay_rate
      end

      context "with name ending in '18-20'" do
        let(:name) { 'Pay rate 18-20' }

        specify do
          expect(PayRate.is_18_to_20).to include(existing_pay_rate)
        end
      end

      context "with name ending in '18-20' with whitespace afterwards" do
        let(:name) { 'Pay rate 18-20  ' }

        it do
          expect(PayRate.is_18_to_20).to include(existing_pay_rate)
        end
      end

      context "name containing '18-20' but not at the end" do
        let(:name) { 'Pay 18-20 rate' }

        specify do
          expect(PayRate.is_18_to_20).to_not include(existing_pay_rate)
        end
      end
    end
  end

  describe "PayRate#is_21_to_24" do
    let(:existing_pay_rate) { FactoryGirl.create(:pay_rate, name: name) }

    describe 'pay rate exists' do
      before do
        existing_pay_rate
      end

      context "with name ending in '21-24'" do
        let(:name) { 'Pay rate 21-24' }

        specify do
          expect(PayRate.is_21_to_24).to include(existing_pay_rate)
        end
      end

      context "with name ending in '21-24' with whitespace afterwards" do
        let(:name) { 'Pay rate 21-24  ' }

        it do
          expect(PayRate.is_21_to_24).to include(existing_pay_rate)
        end
      end

      context "name containing '21-24' but not at the end" do
        let(:name) { 'Pay 21-24 rate' }

        specify do
          expect(PayRate.is_21_to_24).to_not include(existing_pay_rate)
        end
      end
    end
  end

  describe "PayRate#is_25_plus" do
    let(:existing_pay_rate) { FactoryGirl.create(:pay_rate, name: name) }

    describe 'pay rate exists' do
      before do
        existing_pay_rate
      end

      context "with name ending in '25+'" do
        let(:name) { 'Pay rate 25+' }

        specify do
          expect(PayRate.is_25_plus).to include(existing_pay_rate)
        end
      end

      context "with name ending in '25+' with whitespace afterwards" do
        let(:name) { 'Pay rate 25+  ' }

        it do
          expect(PayRate.is_25_plus).to include(existing_pay_rate)
        end
      end

      context "name containing '25+' but not at the end" do
        let(:name) { 'Pay 25+ rate' }

        specify do
          expect(PayRate.is_25_plus).to_not include(existing_pay_rate)
        end
      end
    end
  end
end
