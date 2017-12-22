require 'rails_helper'

describe VenueMessagesDashboardQuery do
  let(:venue) do
    FactoryGirl.create(:venue)
  end

  let(:user) { FactoryGirl.create(:user, venues: [venue]) }

  let(:query) do
    VenueMessagesDashboardQuery.new(venue: venue)
  end

  let(:dashboard_message) do
    FactoryGirl.create_list(:dashboard_message, 10, created_by_user: user, venues: [venue])
  end

  context 'before call' do
    it "query should'n return messages" do
      expect(query.all.count).to eq(0)
    end
  end

  context 'dashboard messages' do
    before do
      dashboard_message
    end

    specify 'query should return messages' do
      expect(query.all.count).to eq(10)
    end

    specify "query should return -1 message after disable" do
      expect(query.all.count).to eq(10)
      dashboard_message.last.disable(user)
      expect(query.all.count).to eq(9)
    end
  end
end
