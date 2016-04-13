require 'rails_helper'

describe TuesdayFruitOrderReminderJob do
  include ActiveSupport::Testing::TimeHelpers
  include ActiveJob::TestHelper

  let(:job) { TuesdayFruitOrderReminderJob.new }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) do
    FactoryGirl.create(
      :user,
      venues: [venue]
    )
  end

  before do
    venue
    user
  end

  specify do
    job.perform
    expect(ActionMailer::Base::deliveries.count).to eq(1)
    mail = ActionMailer::Base::deliveries.last
    expect(mail.to).to eq([user.email])
  end
end
