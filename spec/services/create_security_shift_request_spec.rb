require 'rails_helper'

describe CreateSecurityShiftRequest do
  include ActiveSupport::Testing::TimeHelpers

  let(:rota_week_start_date) do
    RotaShiftDate.new(RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date).start_time
  end

  let(:creator) { FactoryGirl.create(:user) }
  let(:params) do
    {
      starts_at: starts_at,
      ends_at: ends_at,
      creator: creator
    }
  end

  let(:service) do
    CreateSecurityShiftRequest.new(params: params)
  end

  context 'when given data is invalid' do
    context 'before call' do
      specify 'no shift requests exist' do
        expect(SecurityShiftRequest.count).to eq(0)
      end
    end

    context 'starts_at or ends_at in the past' do
      let(:starts_at) { rota_week_start_date - 2.days}
      let(:ends_at) { rota_week_start_date - 1.days}

      describe 'result ' do
        let(:result) { service.call }

        specify 'shift request is not valid ' do
          expect(result.security_shift_request.valid?).to eq(false)
        end

        specify 'validation errors must present ' do
          errors = result.security_shift_request.errors
          expect(errors.messages[:starts_at]).to eq(["can't be in past"])
          expect(errors.messages[:ends_at]).to eq(["can't be in past"])
        end
      end
    end

    context 'ends at less than starts at ' do
      let(:starts_at) { rota_week_start_date + 5.hours}
      let(:ends_at) { rota_week_start_date + 1.hours}

      describe 'result ' do
        let(:result) { service.call }

        specify 'shift request is not valid' do
          expect(result.security_shift_request.valid?).to eq(false)
        end

        specify 'validation errors must present ' do
          errors = result.security_shift_request.errors
          expect(errors.messages[:base]).to eq(["starts time must be after end time"])
        end
      end
    end
  end
end
