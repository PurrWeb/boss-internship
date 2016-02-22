require 'rails_helper'

describe SendShiftChangeNotifications do
  let(:service) { SendShiftChangeNotifications.new(staff_member) }
  let(:mail) { double('Mail') }
  let(:staff_member) {
    FactoryGirl.create(:staff_member, :requiring_notification)
  }

  context 'before the call' do
    specify 'the staff member requires notification' do
      expect(staff_member.reload.requires_notification?).to eq(true)
    end
  end

  context 'after the call' do
    before do
      allow(ShiftChangeNotificationMailer).to receive(:notify_of_shift_change_mail).with({ staff_member: staff_member }).and_return(mail)
      allow(mail).to receive(:deliver_now)
    end

    it 'should set the staff member as being notified' do
      service.call
      expect(staff_member.reload.requires_notification?).to eq(false)
    end

    it 'should send an update email' do
      expect(ShiftChangeNotificationMailer).to receive(:notify_of_shift_change_mail).with({ staff_member: staff_member }).and_return(mail)
      expect(mail).to receive(:deliver_now)
      service.call
    end

    specify 'if mailing fails user is not marked as notified' do
      error = 'asdasd'
      expect(ShiftChangeNotificationMailer).to receive(:notify_of_shift_change_mail).and_raise(error)

      expect{
        service.call
      }.to raise_error(error)
      expect(staff_member.reload.requires_notification?).to eq(true)
    end
  end
end
