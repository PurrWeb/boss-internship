require 'feature/feature_spec_helper'

RSpec.describe 'Shift notification Emails' do
  include ActiveSupport::Testing::TimeHelpers
  include ActiveJob::TestHelper

  context 'when staff member is marked as requiring notification' do
    let(:now) { Time.current }
    let(:this_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }
    let(:next_week) { RotaWeek.new(this_week.start_date + 1.week) }

    let(:staff_member) { FactoryGirl.create(:staff_member, shift_change_occured_at: now) }
    let(:rota) { FactoryGirl.create(:rota, :published, date: next_week.start_date) }
    let(:shift) do
      FactoryGirl.create(
        :rota_shift,
        rota: rota,
        staff_member: staff_member,
        starts_at: RotaShiftDate.new(rota.date).start_time,
        ends_at: RotaShiftDate.new(rota.date).start_time + 2.hours
      )
    end
    before do
      travel_to now do
        #initialise objects
        shift
      end
    end

    context 'when less than 30 minutes have passed' do
      specify 'running the ShiftUpdateNotificationJob should not send any emails' do
        assert_enqueued_jobs 0 do
          ShiftUpdateNotificationJob.new.perform
        end
      end
    end

    context 'when more than 30 minutes have passed' do
      specify 'running the ShiftUpdateNotificationJob should send the staff member an update email' do
        travel_to(now + 32.minutes) do
          assert_enqueued_with(job: SendStaffMemberShiftUpdateJob, args: [staff_member.id]) do
            ShiftUpdateNotificationJob.new.perform
          end
        end
      end
    end
  end
end
