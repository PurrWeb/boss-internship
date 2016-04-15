require 'feature/feature_spec_helper'

RSpec.describe 'Shift notification Emails' do
  include ActiveSupport::Testing::TimeHelpers

  context 'when staff member is marked as requiring notification' do
    let(:this_week) { RotaWeek.new(Time.zone.now) }
    let(:next_week) { RotaWeek.new(this_week.start_date + 1.week) }
    let(:now) { this_week.start_date }
    around(:each) do |example|
      travel_to now do
        example.run
      end
    end

    let(:staff_member) { FactoryGirl.create(:staff_member, shift_change_occured_at: now) }
    let(:rota) { FactoryGirl.create(:rota, :published, date: next_week.start_date) }
    let!(:shift) do
      FactoryGirl.create(
        :rota_shift,
        rota: rota,
        staff_member: staff_member,
        starts_at: RotaShiftDate.new(rota.date).start_time,
        ends_at: RotaShiftDate.new(rota.date).start_time + 2.hours
      )
    end

    context 'when less than 30 minutes have passed' do
      specify 'running the ShiftUpdateNotificationJob should not send any emails' do
        ShiftUpdateNotificationJob.new.perform
        expect(ActionMailer::Base.deliveries).to be_empty
      end
    end

    context 'when more than 30 minutes have passed' do
      specify 'running the ShiftUpdateNotificationJob should send the staff member an update email' do
        travel_to(Time.zone.now + 31.minutes) do
          ShiftUpdateNotificationJob.new.perform
          expect(ActionMailer::Base.deliveries).to_not be_empty
        end
      end
    end
  end
end
