require 'rails_helper'

describe StaffMembersWithExpiringSiaBadgeQuery do
  let!(:call_time) { Time.zone.now }
  let(:query) { StaffMembersWithExpiringSiaBadgeQuery.new(now: call_time) }
  let!(:security_staff_member) do
    FactoryGirl.create(
      :staff_member,
      :security,
      notified_of_sia_expiry_at: notified_at,
      sia_badge_expiry_date: badge_expiry_date
    )
  end
  let(:notified_at) { nil }

  context 'SIA expiry date is less than 6 weeks away' do
    let(:badge_expiry_date) { call_time + 6.weeks - 1.day }

    specify 'its should return the staff member' do
      assert_returned(security_staff_member)
    end

    context 'staff_member has been notified' do
      let(:notified_at) { call_time }

      specify 'its should not return the staff member' do
        assert_not_returned(security_staff_member)
      end
    end
  end

  context 'SIA expiry date is more than 6 weeks away' do
    let(:badge_expiry_date) { call_time + 6.weeks + 1.day }

    specify 'its should not return the staff member' do
      assert_not_returned(security_staff_member)
    end
  end

  def assert_returned(staff_member)
    expect(query.all.count).to eq(1)
    expect(query.all.first).to eq(security_staff_member)
  end

  def assert_not_returned(staff_member)
    expect(query.all.count).to eq(0)
  end
end
