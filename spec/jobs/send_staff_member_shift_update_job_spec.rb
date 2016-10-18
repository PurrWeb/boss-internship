require 'rails_helper'

describe SendStaffMemberShiftUpdateJob do
  subject { SendStaffMemberShiftUpdateJob.new }
  let(:send_shift_change_notifications_service) { double('send shift change notifications service')}

  before do
    allow(SendShiftChangeNotifications).to receive(:new).and_return(send_shift_change_notifications_service)
    allow(send_shift_change_notifications_service).to receive(:call)
  end

  context 'supplied id corresponds to staff member' do
    let(:staff_member_id) { staff_member.id }


    context 'staff member is enabled' do
      let(:staff_member) do
        FactoryGirl.create(:staff_member)
      end

      it 'should instantiate and call a notification service object' do
        expect(SendShiftChangeNotifications).to receive(:new).with(staff_member)
        expect(send_shift_change_notifications_service).to receive(:call)
        subject.perform(staff_member_id)
      end
    end

    context 'staff member is disabled' do
      let(:staff_member) do
        FactoryGirl.create(:staff_member, :disabled)
      end

      it 'should not instantiate and call a notification service object' do
        expect(SendShiftChangeNotifications).to_not receive(:new).with(staff_member)
        expect(send_shift_change_notifications_service).to_not receive(:call)
        subject.perform(staff_member_id)
      end
    end
  end

  context 'supplied id does not correspond to a staff member' do
    let(:staff_member_id) { 2 }

    it 'should not instantiate and call a notification service object' do
      expect(SendShiftChangeNotifications).to_not receive(:new)
      expect(send_shift_change_notifications_service).to_not receive(:call)
      subject.perform(staff_member_id)
    end
  end
end
