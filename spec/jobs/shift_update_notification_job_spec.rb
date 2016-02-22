require 'rails_helper'

describe ShiftUpdateNotificationJob do
  let(:job) { ShiftUpdateNotificationJob.new }
  let(:staff_member) { double('Dummy staff member') }
  let(:query_scope) { double('Query scope') }
  let(:notification_service) { double('Notification Service') }

  describe "#perform" do
    before do
      allow(query_scope).to receive(:find_each).and_yield(staff_member)
      allow_any_instance_of(StaffMemberWithShiftNotificationsQuery).to receive(:all).and_return(query_scope)
      allow(SendShiftChangeNotifications).to receive(:new).with(staff_member).and_return(notification_service)
      allow(notification_service).to receive(:call)
    end

    it 'should pull a list of all staff members' do
      expect_any_instance_of(StaffMemberWithShiftNotificationsQuery).to receive(:all).and_return(query_scope)
      job.perform
    end

    it 'should iterate the staff members' do
      expect(query_scope).to receive(:find_each).and_yield(staff_member)
      job.perform
    end

    it 'should instanciate the notification service' do
      expect(SendShiftChangeNotifications).to receive(:new).with(staff_member).and_return(notification_service)
      job.perform
    end

    it 'should call the notification service for the staff member' do
      expect(notification_service).to receive(:call)
      job.perform
    end
  end
end
