require 'feature/feature_spec_helper'

RSpec.describe 'Shift notification Emails' do
  include ActiveSupport::Testing::TimeHelpers

  let(:this_week) { RotaWeek.new(Time.now) }
  let(:next_week) { RotaWeek.new(this_week.start_date + 1.week) }
  let(:now) { this_week.start_date }
  around(:each) do |example|
    travel_to now do
      example.run
    end
  end

  let(:user) { FactoryGirl.create(:user, :dev) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:rota) { FactoryGirl.create(:rota, :finished, date: next_week.start_date) }
  let!(:shift) do
    FactoryGirl.create(
      :rota_shift,
      rota: rota,
      staff_member: staff_member,
      starts_at: RotaShiftDate.new(rota.date).start_time,
      ends_at: RotaShiftDate.new(rota.date).start_time + 2.hours
    )
  end

  specify do
    expect(ActionMailer::Base.deliveries).to be_empty
    PublishRotaWeek.new(week: next_week, venue: rota.venue, requester: user).call
    ShiftUpdateNotificationJob.new.perform
    expect(ActionMailer::Base.deliveries).to be_empty
    travel 30.minutes do
      ShiftUpdateNotificationJob.new.perform
      expect(ActionMailer::Base.deliveries).to be_empty
    end
  end
end
