require 'rails_helper'

describe VenueWithoutChangeOrderNotificationQuery do
  include ActiveSupport::Testing::TimeHelpers

  let(:date) { RotaWeek.new(RotaShiftDate.to_rota_date(Time.zone.now)).start_date }
  let(:query) { VenueWithoutChangeOrderNotificationQuery.new(date: date) }

  context 'venue exists with no notifications' do
    let(:venue) { FactoryGirl.create(:venue) }

    before do
      venue
    end

    specify 'venue should be returned' do
      expect(query.all.count).to eq(1)
      expect(query.all.first).to eq(venue)
    end
  end

  context 'venue exists with notification in current week' do
    let(:venue) { FactoryGirl.create(:venue) }
    let(:notification) do
      FactoryGirl.create(
        :change_order_notification,
        venue: venue
      )
    end

    before do
      venue
      notification
    end

    specify 'venue should not be returned' do
      expect(query.all.count).to eq(0)
    end
  end

  context 'venue exists with notification in past week' do
    let(:past_week) { date - 1.week }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:notification) do
      travel_to past_week do
        FactoryGirl.create(
          :change_order_notification,
          venue: venue
        )
      end
    end

    before do
      venue
      notification
    end

    specify 'venue should be returned' do
      expect(query.all.count).to eq(1)
      expect(query.all.first).to eq(venue)
    end
  end

  context 'venue exists with notification in future week' do
    let(:future_week) { date + 1.week }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:notification) do
      travel_to future_week do
        FactoryGirl.create(
          :change_order_notification,
          venue: venue
        )
      end
    end

    before do
      venue
      notification
    end

    specify 'venue should be returned' do
      expect(query.all.count).to eq(1)
      expect(query.all.first).to eq(venue)
    end
  end
end
