require 'rails_helper'

describe MarkRetakeAvatar do
  let(:requester) { FactoryGirl.create(:user) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:now) { Time.current }
  let(:service) do
    MarkRetakeAvatar.new(
      requester: requester,
      staff_member: staff_member,
      now: now
    )
  end
  let(:mock_ability) { double('mock ability') }

  before do
    allow(UserAbility).to(
      receive(:new).with(requester).and_return(mock_ability)
    )
    allow(mock_ability).to receive(:authorize!)
  end

  context 'before call' do
    specify 'staff_member#mark_retake_avatar? should be false' do
      expect(staff_member.marked_retake_avatar?).to eq(false)
    end
  end

  specify 'it should mark the staff member' do
    service.call
    expect(staff_member.marked_retake_avatar?).to eq(true)
  end

  it 'should set the correct date' do
    service.call
    expect(staff_member.marked_retake_avatar_at).to eq(now)
  end

  it 'should create and test ability' do
    expect(mock_ability).to receive(:authorize!).with(:mark_retake_avatar, staff_member)
    service.call
  end

  context 'when ability fails is false' do
    it 'should raise an error' do
      raised_error = 'raised_error'
      allow(mock_ability).to(
        receive(:authorize!).with(:mark_retake_avatar, staff_member)
      ).and_raise(raised_error)

      expect{ service.call }.to raise_error(raised_error)
    end
  end
end
