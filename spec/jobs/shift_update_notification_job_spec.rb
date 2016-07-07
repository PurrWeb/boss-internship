require 'rails_helper'

describe ShiftUpdateNotificationJob do
  include ActiveSupport::Testing::TimeHelpers

  let(:job) { ShiftUpdateNotificationJob.new }
  let(:staff_member) { double('Dummy staff member') }
  let(:staff_member_id) { double('Staff Member ID') }
  let(:query_scope) { double('Query scope') }
  let(:staff_member_shift_update_job_class) { double('Staff Member Shift Update Job class') }
  let(:staff_member_shift_update_job_instance) { double('Staff Member Shift Update Job instance') }

  describe "#perform" do
    before do
      allow(query_scope).to receive(:find_each).and_yield(staff_member)
      allow_any_instance_of(StaffMemberWithShiftNotificationsQuery).to receive(:all).and_return(query_scope)
      allow(SendStaffMemberShiftUpdateJob).to receive(:set).and_return(staff_member_shift_update_job_instance)
      allow(staff_member).to receive(:id).and_return(staff_member_id)
      allow(staff_member_shift_update_job_instance).to receive(:perform_later)
    end

    it 'should pull a list of all staff members' do
      expect_any_instance_of(StaffMemberWithShiftNotificationsQuery).to receive(:all).and_return(query_scope)
      job.perform
    end

    it 'should iterate the staff members' do
      expect(query_scope).to receive(:find_each).and_yield(staff_member)
      job.perform
    end
  end
end
