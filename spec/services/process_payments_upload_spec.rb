require 'rails_helper'

describe ProcessPaymentsUpload do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:requester) { FactoryGirl.create(:user) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:mock_raw_data) { { raw: 'data' } }
  let(:valid_payment_datum) do
    {
      venue: venue,
      staff_member: staff_member,
      raw_data: mock_raw_data,
      normalised_data: normalised_payment_data,
      errors: {}
    }.freeze
  end
  let(:valid_payment_data) { [valid_payment_datum] }
  let(:mock_invalid_payment_data) do
    { foo: 'barr' }
  end
  let(:invalid_payment_data) { [mock_invalid_payment_data] }
  let(:parsed_upload) do
    {
      valid_payments: valid_payment_data,
      invalid_payments: invalid_payment_data
    }
  end
  let(:service) { ProcessPaymentsUpload.new(requester: requester, parsed_upload: parsed_upload) }
  let(:result) { service.call }
  let(:call_time) { now }

  around(:each) do |example|
    travel_to call_time do
      example.run
    end
  end

  context 'no matching payment exists' do
    context 'payment data is valid' do
      let(:valid_normalised_payment_data) do
        {
          ParsePaymentUploadCSV::PROCCESS_DATE_HEADER => now.to_date,
          ParsePaymentUploadCSV::FIRST_INITIAL_HEADER => 'd',
          ParsePaymentUploadCSV::SURNAME_HEADER => 'Foo',
          ParsePaymentUploadCSV::COMPANY_NAME_HEADER => 'bar',
          ParsePaymentUploadCSV::DEPARTMENT_NAME_HEADER => 'Paaadf',
          ParsePaymentUploadCSV::NI_HEADER => '23DFFDS23',
          ParsePaymentUploadCSV::DOB_HEADER => now.to_date - 20.years,
          ParsePaymentUploadCSV::NET_PAY_HEADER => 234
        }
      end
      let(:normalised_payment_data) { valid_normalised_payment_data }

      it 'should create payment' do
        expect(Payment.count).to eq(0)
        service.call
        expect(Payment.count).to eq(1)
      end

      it 'should list new payment in data' do
        expect(result).to eq({
            created_payments: [
              valid_payment_datum.merge(
                payment: Payment.first
              )
            ],
            updated_payments: [],
            skipped_invalid_payments: parsed_upload.fetch(:invalid_payments),
            skipped_existing_payments: []
        })
      end
    end

    context 'payment data is invalid' do
      let(:invalid_normalised_payment_data) do
        {
          ParsePaymentUploadCSV::PROCCESS_DATE_HEADER => now.to_date,
          ParsePaymentUploadCSV::FIRST_INITIAL_HEADER => 'd',
          ParsePaymentUploadCSV::SURNAME_HEADER => 'Foo',
          ParsePaymentUploadCSV::DEPARTMENT_NAME_HEADER => 'bar',
          ParsePaymentUploadCSV::COMPANY_NAME_HEADER => 'Paaadf',
          ParsePaymentUploadCSV::NI_HEADER => '23DFFDS23',
          ParsePaymentUploadCSV::DOB_HEADER => now.to_date - 20.years,
          ParsePaymentUploadCSV::NET_PAY_HEADER => nil
        }
      end
      let(:normalised_payment_data) { invalid_normalised_payment_data }

      it 'should not create payment' do
        expect(Payment.count).to eq(0)
        service.call
        expect(Payment.count).to eq(0)
      end

      it 'should list new payment in data' do
        expect(result.fetch(:created_payments).count).to eq(0)
        expect(result.fetch(:updated_payments).count).to eq(0)
        expect(result.fetch(:skipped_existing_payments).count).to eq(0)
        expect(result.fetch(:skipped_invalid_payments).count).to eq(invalid_payment_data.count + 1)

        result_invalid_payments = result.fetch(:skipped_invalid_payments)
        expect(result_invalid_payments[0]).to eq(mock_invalid_payment_data)
        result_invalid_payment = result_invalid_payments[1]
        expect(result_invalid_payment.fetch(:raw_data)).to eq(valid_payment_datum.fetch(:raw_data))
        expect(result_invalid_payment.fetch(:normalised_data)).to eq(valid_payment_datum.fetch(:normalised_data))
        expect(result_invalid_payment.fetch(:staff_member)).to eq(valid_payment_datum.fetch(:staff_member))
        expect(result_invalid_payment.fetch(:venue)).to eq(valid_payment_datum.fetch(:venue))
        expect(
          result_invalid_payment.fetch(:errors)
        ).to eq({
          payment: {
            :cents=> "can't be blank"
          }
        })
      end
    end
  end

  context 'staff member has existing payment' do
    let(:valid_normalised_payment_data) do
      {
        ParsePaymentUploadCSV::PROCCESS_DATE_HEADER => existing_process_date,
        ParsePaymentUploadCSV::FIRST_INITIAL_HEADER => 'd',
        ParsePaymentUploadCSV::SURNAME_HEADER => 'Foo',
        ParsePaymentUploadCSV::DEPARTMENT_NAME_HEADER => 'bar',
        ParsePaymentUploadCSV::DEPARTMENT_NAME_HEADER => 'Paaadf',
        ParsePaymentUploadCSV::NI_HEADER => '23DFFDS23',
        ParsePaymentUploadCSV::DOB_HEADER => now.to_date - 20.years,
        ParsePaymentUploadCSV::NET_PAY_HEADER => new_payment_cents
      }
    end
    let(:normalised_payment_data) { valid_normalised_payment_data }
    let(:existing_payment) do
      Payment.create!(
        staff_member: staff_member,
        cents: existing_payment_cents,
        created_by_user: requester,
        date: existing_process_date
      )
    end
    let(:existing_process_date) { now.to_date }
    let(:existing_created_at) { now - 3.weeks }

    before do
      travel_to existing_created_at do
        existing_payment
      end
    end

    context 'payment matches existing unaccepted payment' do
      context 'cent amount has changed' do
        let(:existing_payment_cents) { 100 }
        let(:new_payment_cents) { 234 }

        it 'should not create new payment' do
          expect(Payment.count).to eq(1)
          service.call
          expect(Payment.count).to eq(1)
        end

        it 'should update payment' do
          service.call
          payment = Payment.first
          expect(payment.updated_at).to_not eq(existing_created_at)
          expect(payment.cents).to eq(new_payment_cents)
          expect(payment.current_state).to eq('pending')
        end

        context 'existing payment is already accepted' do
          before do
            existing_payment.mark_received!
          end

          it 'should make it pending again' do
            service.call
            payment = Payment.first
            expect(payment.current_state).to eq('pending')
          end
        end
      end

      context 'cent amount is unchanged' do
        let(:existing_payment_cents) { 100 }
        let(:new_payment_cents) { existing_payment_cents }

        it 'should not create new payment' do
          expect(Payment.count).to eq(1)
          service.call
          expect(Payment.count).to eq(1)
        end

        it 'should not update payment' do
          service.call
          payment = Payment.first
          expect(payment.updated_at).to eq(existing_created_at.round)
          expect(payment.cents).to eq(existing_payment_cents)
          expect(payment.current_state).to eq('pending')
        end
      end
    end
  end
end
