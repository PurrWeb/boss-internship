require 'rails_helper'

describe StaffMemberWithShiftNotificationsQuery do
  let(:query) { StaffMemberWithShiftNotificationsQuery.new }
  let!(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      shift_change_occured_at: shift_change_occured_at
    )
  end

  context 'staff member has had a shift change more than 30 minutes ago' do
    let(:shift_change_occured_at) { Time.now - 40.minutes }

    specify 'they should be present in results' do
      expect(query.all.count).to eq(1)
      expect(query.all.first).to eq(staff_member)
    end

    context 'staff member is disabled' do
      let(:staff_member) do
        FactoryGirl.create(
          :staff_member,
          enabled: false,
          shift_change_occured_at: shift_change_occured_at
        )
      end

      specify 'they shoud not be present in results' do
        expect(query.all.count).to eq(0)
      end
    end
  end

  context 'staff member has has a shift change less than 30 minutes ago' do
    let(:shift_change_occured_at) { Time.now - 20.minutes }

    specify 'they shoud not be present in results' do
      expect(query.all.count).to eq(0)
    end
  end

  context 'staff member has not had shift change' do
    let(:shift_change_occured_at) { nil }

    specify 'should not be present in results' do
      expect(query.all.count).to eq(0)
    end
  end
end
