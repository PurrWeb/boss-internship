require 'rails_helper'

describe DisableRotaShift do
  include ActiveSupport::Testing::TimeHelpers

  let(:shift) { FactoryGirl.create(:rota_shift) }
  let(:user) { FactoryGirl.create(:user) }
  let(:service) { DisableRotaShift.new(requester: user, shift: shift) }
  let(:call_time) { Time.now.round }

  describe 'shift' do
    it 'should be disabled' do
      service.call
      expect(shift).to be_disabled
    end

    it 'should have disabled_at set' do
      travel_to(call_time) do
        service.call
      end

      expect(shift.disabled_at).to eq(call_time)
    end

    it 'should have disabled_by_user set' do
      service.call
      expect(shift.disabled_by_user).to eq(user)
    end
  end

  context 'when shift is already disabled' do
    let(:shift) do
      FactoryGirl.create(
        :rota_shift,
        enabled: false,
        disabled_by_user: user,
        disabled_at: 2.years.ago
      )
    end

    specify 'it throws an error' do
      expect{
        service.call
      }.to raise_error('shift already disabled')
    end
  end
end
