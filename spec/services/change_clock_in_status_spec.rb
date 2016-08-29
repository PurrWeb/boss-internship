require 'rails_helper'

describe ChangeClockInStatus  do
  include ActiveSupport::Testing::TimeHelpers

  describe 'Clocking in' do
    let(:day_start) { RotaShiftDate.new(Time.current).start_time }
    let(:now) { day_start + 2.hours }
    let(:date) { RotaShiftDate.to_rota_date(now) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
    let(:requester) { FactoryGirl.create(:user) }
    let(:state) { :clocked_in }
    let(:service) do
      ChangeClockInStatus.new(
        date: date,
        venue: venue,
        requester: requester,
        staff_member: staff_member,
        state: state,
        at: now
      )
    end
    let(:result) { service.call }

    around(:each) do |example|
      travel_to now do
        example.run
      end
    end

    before do
      staff_member
    end

    it 'should succeed' do
      expect(result.success?).to eq(true)
    end

    context 'staff member is already clocked in at other venue' do
      let(:other_venue) { FactoryGirl.create(:venue) }

      before do
        travel_to day_start do
          previous_transition = ChangeClockInStatus.new(
            date: date,
            venue: other_venue,
            requester: requester,
            staff_member: staff_member,
            state: :clocked_in,
            at: Time.current
          )

          expect(previous_transition.call.success).to eq(true)
        end
      end

      it 'should fail' do
        expect(result.success?).to eq(false)
      end
    end
  end
end
