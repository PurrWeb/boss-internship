require 'rails_helper'

describe DailyReportsIndexStaffMemberQuery do
  let(:date) { RotaShiftDate.to_rota_date(Time.current) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:rota) do
    FactoryGirl.create(
      :rota,
      venue: venue,
      date: date
    )
  end
  let(:query) do
    DailyReportsIndexStaffMemberQuery.new(
      date: date,
      rota: rota,
      venue: venue
    )
  end

  context 'staff member exists with shift on day' do
    let(:creator) { FactoryGirl.create(:user) }
    let(:start_time) { RotaShiftDate.new(date).start_time }
    let(:staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:rota_shift) do
      RotaShift.create!(
        shift_type: 'normal',
        creator: creator,
        rota: rota,
        staff_member: staff_member,
        starts_at: start_time + 1.hour,
        ends_at: start_time + 3.hours
      )
    end

    before do
      rota_shift
    end

    specify do
      expect(query.all).to include(staff_member)
    end
  end

  context 'staff member exists with shift on other day' do
    let(:creator) { FactoryGirl.create(:user) }
    let(:other_rota) do
      FactoryGirl.create(
        :rota,
        venue: venue,
        date: date + 1.day
      )
    end
    let(:start_time) { RotaShiftDate.new(other_rota.date).start_time }
    let(:staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:rota_shift) do
      RotaShift.create!(
        shift_type: 'normal',
        creator: creator,
        rota: other_rota,
        staff_member: staff_member,
        starts_at: start_time + 1.hour,
        ends_at: start_time + 3.hours
      )
    end

    before do
      rota_shift
    end

    specify do
      expect(query.all).to_not include(staff_member)
    end
  end

  context 'staff member has clocked in that day' do
    let(:creator) { FactoryGirl.create(:user) }
    let(:staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:clock_in_day) do
      ClockInDay.create!(
        date: date,
        staff_member: staff_member,
        creator: creator,
        venue: venue
      )
    end

    before do
      clock_in_day
    end

    specify do
      expect(query.all).to include(staff_member)
    end
  end

  context 'staff member has clocked in on other day' do
    let(:creator) { FactoryGirl.create(:user) }
    let(:staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:clock_in_day) do
      ClockInDay.create!(
        date: date + 1.day,
        staff_member: staff_member,
        creator: creator,
        venue: venue
      )
    end

    before do
      clock_in_day
    end

    specify do
      expect(query.all).to_not include(staff_member)
    end
  end
end
