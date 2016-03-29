require 'rails_helper'

describe ChangeOrderReminderJob do
  include ActiveSupport::Testing::TimeHelpers
  include ActiveJob::TestHelper

  let(:now) { Time.now }
  let(:week) { RotaWeek.new(now) }
  let(:deadline) { ChangeOrderSubmissionDeadline.new(week: week) }
  let(:job) { ChangeOrderReminderJob.new }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) do
    FactoryGirl.create(
      :user,
      venues: [venue]
    )
  end

  around(:each) do |example|
    deadline
    travel_to deadline.time - 1.hour do
      example.run
    end
  end

  before do
    venue
    user
  end

  specify do
    expect(ChangeOrderNotification.count).to eq(0)
    job.perform
    expect(ChangeOrderNotification.count).to eq(1)
  end

  specify do
    job.perform
    expect(ActionMailer::Base::deliveries.count).to eq(1)
    mail = ActionMailer::Base::deliveries.last
    expect(mail.to).to eq([user.email])
  end
end
