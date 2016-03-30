require 'rails_helper'

describe VenueWithoutChangeOrderQuery do
  let(:date) do
    RotaWeek.new(Time.now).start_date
  end
  let(:query) { VenueWithoutChangeOrderQuery.new(date: date) }

  context 'venue exists with no change order' do
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

  context 'venue exists with current change order' do
    let(:venue) do
      FactoryGirl.create(:venue)
    end
    let(:change_order) do
      FactoryGirl.create(
        :change_order,
        date: date,
        venue: venue
      )
    end

    before do
      change_order
      venue
    end

    specify 'venue should not be returned' do
      expect(query.all.count).to eq(0)
    end
  end

  context 'venue exists with only future change orders' do
    let(:venue) do
      FactoryGirl.create(:venue)
    end
    let(:change_order) do
      FactoryGirl.create(
        :change_order,
        date: date + 1.week,
        venue: venue
      )
    end

    before do
      change_order
      venue
    end

    specify 'venue should be returned' do
      expect(query.all.count).to eq(1)
      expect(query.all).to include(venue)
    end
  end

  context 'venue with only past change orders should be returned' do
    let(:venue) do
      FactoryGirl.create(:venue)
    end
    let(:change_order) do
      FactoryGirl.create(
        :change_order,
        date: date - 1.week,
        venue: venue
      )
    end

    before do
      change_order
      venue
    end

    specify 'venue should be returned' do
      expect(query.all.count).to eq(1)
      expect(query.all).to include(venue)
    end
  end
end
