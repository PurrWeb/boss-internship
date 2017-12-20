require 'rails_helper'

RSpec.describe 'DeleteUser service'  do
  include ActiveSupport::Testing::TimeHelpers

  let(:requester) { FactoryGirl.create(:user) }
  let(:user) { FactoryGirl.create(:user) }
  let(:mock_frontend_update_service) { double('mock_frontend_update_service')}
  let(:service) do
    DeleteUser.new(
      requester: requester,
      user: user,
      would_rehire: would_rehire,
      disable_reason: disable_reason,
      frontend_updates: mock_frontend_update_service
    )
  end
  let(:would_rehire) { true }
  let(:disable_reason) { "Got nominated for the oscar for best supporting actor in a comedy" }

  context 'before call' do
    specify 'user should be enabled' do
      expect(user).to be_enabled
    end
  end

  context 'after call' do
    specify 'user is disabled' do
      service.call
      expect(user.reload).to_not be_enabled
    end

    specify 'requester metadata is stored with transition' do
      service.call
      last_transition = user.reload.state_machine.last_transition
      expect(last_transition.metadata["requster_user_id"]).to eq(requester.id)
    end

    context 'when would not rehire' do
      let(:would_rehire) { false }

      it 'marks the staff member as a not rehire' do
        service.call
        expect(user.would_rehire?).to eq(false)
      end

      it 'persists the rehire reason' do
        service.call
        expect(user.disable_reason).to eq(disable_reason)
      end

      context 'no reason is given' do
        let(:disable_reason) { nil }

        specify 'it should' do
          expect {
            service.call
          }.to raise_error('disable_reason required')
        end
      end
    end
  end

  context 'user hass assocaited staff member' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:user) { FactoryGirl.create(:user, staff_member: staff_member) }

    specify 'staff member should be disabled' do
      service.call
      expect(staff_member.reload).to be_disabled
    end
  end
end
