require 'rails_helper'

describe VenueWithoutChangeOrderQuery do
  let(:date) do
    RotaWeek.new(Time.now).start_date
  end
  let(:query) { VenueWithoutChangeOrderQuery.new(change_orders: change_orders) }

  context 'venue not related to change orders' do
    let(:change_orders) { ChangeOrder.none }
    let(:venue) do
      FactoryGirl.create(:venue)
    end

    before do
      venue
    end

    specify 'venue should be returned' do
      expect(query.all.count).to eq(1)
      expect(query.all).to include(venue)
    end
  end

  context 'venue is related to change orders' do
    let(:venue) do
      FactoryGirl.create(:venue)
    end
    let(:change_order) do
      FactoryGirl.create(
        :change_order,
        venue: venue
      )
    end
    let(:change_orders) do
      ChangeOrder.all
    end

    before do
      change_order
      venue
    end

    specify 'venue should not be returned' do
      expect(query.all.count).to eq(0)
    end
  end
end
