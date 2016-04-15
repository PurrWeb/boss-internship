require 'rails_helper'

describe SendSiaBadgeExpiryNotifications do
  let(:call_time) { Time.zone.now.round }
  let(:service) { SendSiaBadgeExpiryNotifications.new(now: call_time) }
  let(:user) { FactoryGirl.create(:user, :dev, staff_member: nil) }
  let(:security_staff_members) do
    Array.new(2) do
      FactoryGirl.create(:staff_member, :security, creator: user)
    end
  end
  let(:security_staff_members_relation) { StaffMember.security }
  let(:staff_member_query_instance) { double('staff member query instance') }

  before do
    security_staff_members
    allow(StaffMembersWithExpiringSiaBadgeQuery).to receive(:new).and_return(security_staff_members_relation)
  end

  context 'before call' do
    specify 'staff members should be ready for updates' do
      security_staff_members.each do |staff_member|
        expect(staff_member.notified_of_sia_expiry_at).to eq(nil)
      end
    end
  end

  specify 'it should query staff member' do
    expect(StaffMembersWithExpiringSiaBadgeQuery).to receive(:new).and_return(security_staff_members_relation)
    service.call
  end

  specify 'staff members should be marked as notified' do
    service.call
    security_staff_members.each do |staff_member|
      expect(staff_member.reload.notified_of_sia_expiry_at).to eq(call_time)
    end
  end
end
