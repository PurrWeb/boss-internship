require 'rails_helper'

describe ReviveUser do
  let(:requester) { FactoryGirl.create(:user) }
  let(:user) do
    FactoryGirl.create(
      :user,
      :disabled,
      staff_member: staff_member
    )
  end
  let(:staff_member) { nil }
  let(:service) do
    ReviveUser.new(
      requester: requester,
      user: user
    )
  end

  context 'before call' do
    specify 'staff member is disabled' do
      expect(user).to be_disabled
    end

    specify 'staff member disabled_by_user is not requester' do
      expect(user.disabled_by_user).to_not eq(requester)
    end
  end

  context 'after call' do
    describe 'staff member' do
      specify 'is enabled' do
        service.call
        expect(user.reload).to be_enabled
      end

      specify 'transistions requester id is updated' do
        service.call
        expect(
          user.
            state_machine.
            last_transition.
            metadata.
            fetch("requster_user_id")
        ).to eq(requester.id)
      end
    end
  end
end
