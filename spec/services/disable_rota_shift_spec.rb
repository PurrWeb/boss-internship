require 'rails_helper'

describe DisableRotaShift do
  include ActiveSupport::Testing::TimeHelpers

  let(:shift) { FactoryGirl.create(:rota_shift, staff_member: staff_member) }
  let(:staff_member) { FactoryGirl.create(:staff_member)}
  let(:user) { FactoryGirl.create(:user) }
  let(:service) { DisableRotaShift.new(requester: user, shift: shift) }
  let(:call_time) { Time.zone.now.round }

  context 'before call' do
    specify 'staff member should not require notification' do
      expect(staff_member.requires_notification?).to eq(false)
    end
  end

  context 'after call' do
    specify 'staff member should not require notification' do
      expect(staff_member.reload.requires_notification?).to eq(false)
    end

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

  context 'when shifts rota is published' do
    let(:rota) { FactoryGirl.create(:rota, :published) }
    let(:shift) do
      FactoryGirl.create(
        :rota_shift,
        rota: rota,
        staff_member: staff_member
      )
    end

    specify 'staff member should be marked as requiring notiifcation' do
      service.call
      expect(staff_member.reload.requires_notification?).to eq(true)
    end
  end
end
