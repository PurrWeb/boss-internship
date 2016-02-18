require 'rails_helper'

RSpec.describe 'DeleteHoliday service'  do
  let(:requester) { FactoryGirl.create(:user) }
  let(:holiday) { FactoryGirl.create(:holiday) }
  let(:service) do
    DeleteHoliday.new(
      requester: requester,
      holiday: holiday
    )
  end

  context 'before call' do
    specify 'holiday should be enabled' do
      expect(holiday.current_state).to eq('enabled')
    end
  end

  context 'after call' do
    before do
      service.call
    end

    specify 'holiday is disabled' do
      expect(holiday.reload.current_state).to eq('disabled')
    end

    specify 'requester metadata is stored with transition' do
      last_transition = holiday.reload.state_machine.last_transition
      expect(last_transition.metadata["requster_user_id"]).to eq(requester.id)
    end
  end
end
