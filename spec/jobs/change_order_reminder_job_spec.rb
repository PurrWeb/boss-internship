require 'rails_helper'

describe ChangeOrderReminderJob do
  include ActiveSupport::Testing::TimeHelpers
  include ActiveJob::TestHelper

  let(:now) { Time.zone.now }
  let(:week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }
  let(:job) { ChangeOrderReminderJob.new }
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
