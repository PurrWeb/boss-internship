require 'rails_helper'

RSpec.describe 'DeleteStaffMember service'  do
  include ActiveSupport::Testing::TimeHelpers

  let(:requester) { FactoryGirl.create(:user) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:service) do
    DeleteStaffMember.new(
      requester: requester,
      staff_member: staff_member,
      would_rehire: would_rehire,
      disable_reason: disable_reason
    )
  end
  let(:would_rehire) { true }
  let(:disable_reason) { "Got nominated for the oscar for best supporting actor in a comedy" }

  context 'before call' do
    specify 'staff_member should be enabled' do
      expect(staff_member).to be_enabled
    end
  end

  context 'after call' do
    specify 'staff_member is disabled' do
      service.call
      expect(staff_member.reload).to_not be_enabled
    end

    specify 'requester metadata is stored with transition' do
      service.call
      last_transition = staff_member.reload.state_machine.last_transition
      expect(last_transition.metadata["requster_user_id"]).to eq(requester.id)
    end

    context 'when would not rehire' do
      let(:would_rehire) { false }

      it 'marks the staff member as a not rehire' do
        service.call
        expect(staff_member.would_rehire?).to eq(false)
      end

      it 'persists the rehire reason' do
        service.call
        expect(staff_member.disable_reason).to eq(disable_reason)
      end

      context 'no reason is given' do
        let(:disable_reason) { nil }

        specify 'it should' do
          expect {
            service.call
          }.to raise_error('disable_reason required')
        end
      end
    end

    context 'staff member has shifts in the future' do
      let(:rota_shift_date) { RotaShiftDate.new(Time.now + 2.weeks) }
      let(:rota) do
        FactoryGirl.create(
          :rota,
          :published,
          date: rota_shift_date.rota_date
        )
      end
      let(:future_shift) do
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member,
          starts_at: rota_shift_date.start_time,
          ends_at: rota_shift_date.start_time + 2.hours
        )
      end

      before do
        future_shift
      end

      specify 'shifts should be disabled' do
        service.call
        expect(future_shift.reload).to be_disabled
      end

      specify 'no shift update emails should be sent' do
        service.call
        expect(staff_member.reload.requires_notification?).to eq(false)
      end
    end

    context 'staff member has holidays in the past' do
      let(:holiday) do
        travel_to 3.weeks.ago do
          week =  RotaWeek.new(1.week.from_now)
          FactoryGirl.create(
            :holiday,
            staff_member: staff_member,
            start_date: week.start_date,
            end_date: week.start_date + 2.days,
            creator: requester
          )
        end
      end

      before do
        holiday
      end

     specify 'holidays should remain enabled' do
        service.call
        expect(holiday.reload).to be_enabled
      end
    end

    context 'staff member has future holidays' do
      let(:week) { RotaWeek.new(Time.now) }
      let(:holiday) do
        travel_to 1.week.ago do
          FactoryGirl.create(
            :holiday,
            staff_member: staff_member,
            start_date: week.start_date + 1.days,
            end_date: week.start_date + 3.days,
            creator: requester
          )
        end
      end

      before do
        holiday
      end

      specify 'holidays should be disabled' do
        travel_to week.start_date do
          service.call
        end
        expect(holiday.reload).to be_disabled
      end
    end
  end
end
