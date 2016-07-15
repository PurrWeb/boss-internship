require 'rails_helper'

shared_examples "staff member has stuff on week" do
  context 'when staff member has clock_in peroid in week' do
    before do
      ClockInDay.create!(
        venue: venue,
        staff_member: _staff_member,
        date: week.start_date,
        creator: FactoryGirl.create(:user)
      )
    end

    specify 'staff member should be returned' do
      if _return_expectation
        expect(query.all.map(&:id)).to eq([staff_member.id])
      else
        expect(query.all.map(&:id)).to eq([])
      end
    end
  end

  context 'when staff member has enabled owed hours' do
    before do
      travel_to week.start_date - 1.week do
        FactoryGirl.create(
          :owed_hour,
          staff_member: _staff_member,
          week_start_date: week.start_date,
        )
      end

      # extra hour To ensure that only one record is returned
      # per joined record
      travel_to week.start_date + 3.week do
        FactoryGirl.create(
          :owed_hour,
          staff_member: _staff_member,
          week_start_date: week.start_date + 3.weeks,
        )
      end
    end

    specify 'staff member should be returned' do
      if _return_expectation
        expect(query.all.map(&:id)).to eq([staff_member.id])
      else
        expect(query.all.map(&:id)).to eq([])
      end
    end
  end

  context 'when staff member has holidays in week' do
    before do
      travel_to week.start_date - 1.week do
        FactoryGirl.create(
          :holiday,
          staff_member: _staff_member,
          start_date: week.start_date,
          end_date: week.start_date + 2.days
        )
      end

      # extra holiday to ensure that only one staff member is returned per
      # joined record
      new_start_date = week.start_date - 1.week
      travel_to new_start_date do
        FactoryGirl.create(
          :holiday,
          staff_member: _staff_member,
          start_date: new_start_date,
          end_date: new_start_date + 2.days
        )
      end
    end

    specify 'staff member should be returned' do
      if _return_expectation
        expect(query.all.map(&:id)).to eq([staff_member.id])
      else
        expect(query.all.map(&:id)).to eq([])
      end
    end
  end
end

describe FinanceReportStaffMembersQuery do
  include ActiveSupport::Testing::TimeHelpers

  let(:venue) { FactoryGirl.create(:venue) }
  let(:week) { RotaWeek.new(Time.current - 1.week) }
  let(:created_at) { week.start_date + 1.day }
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      created_at: created_at,
      master_venue: venue
    )
  end
  let(:query) do
    FinanceReportStaffMembersQuery.new(
      venue: venue,
      week: week
    )
  end

  before do
    staff_member
  end

  specify 'staff member should be returned' do
    expect(query.all.map(&:id)).to eq([staff_member.id])
  end

  context 'staff member is not associated with venue' do
    let(:other_venue) { FactoryGirl.create(:venue) }
    before do
      staff_member.update_attributes!(master_venue: other_venue)
    end

    specify 'staff_member should not be returned' do
      expect(query.all.map(&:id)).to_not eq([staff_member.id])
    end

    include_examples "staff member has stuff on week" do
      let(:_query) { query }
      let(:_staff_member) { staff_member }
      let(:_return_expectation) { false }
    end
  end

  context 'staff member is disabled' do
    let(:requester) { FactoryGirl.create(:user) }
    before do
      DeleteStaffMember.new(
        staff_member: staff_member,
        would_rehire: true,
        disable_reason: 'no reason',
        requester: requester
      ).call
    end

    specify 'staff_member should not be returned' do
      expect(query.all.map(&:id)).to_not eq([staff_member.id])
    end

    include_examples "staff member has stuff on week" do
      let(:_query) { query }
      let(:_staff_member) { staff_member }
      let(:_return_expectation) { true }
    end

    context 'has owed hours' do
      let(:owed_hour) do
        FactoryGirl.create(
          :owed_hour,
          staff_member: staff_member,
          week_start_date: week.start_date
        )
      end

      before do
        travel_to week.start_date - 1.week do
          owed_hour
        end
      end

      specify 'staff member should be returned' do
        expect(query.all.map(&:id)).to eq([staff_member.id])
      end

      context 'owed hours are disabled' do
        let(:owed_hour) do
          FactoryGirl.create(
            :owed_hour,
            :disabled,
            disabled_by: FactoryGirl.create(:user),
            staff_member: staff_member,
            week_start_date: week.start_date
          )
        end

        specify 'staff member should not be returned' do
          expect(query.all.map(&:id)).to_not eq([staff_member.id])
        end
      end
    end
  end

  context 'staff member was created after week started' do
    before do
      staff_member.update_attributes!(created_at: week.start_date + 1.week + 1.day)
    end

    specify 'staff_member should not be returned' do
      expect(query.all.map(&:id)).to_not eq([staff_member.id])
    end

    include_examples "staff member has stuff on week" do
      let(:_query) { query }
      let(:_staff_member) { staff_member }
      let(:_return_expectation) { false }
    end
  end
end
