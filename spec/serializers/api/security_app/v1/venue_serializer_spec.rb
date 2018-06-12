require 'rails_helper'

RSpec.describe Api::SecurityApp::V1::VenueSerializer do
  let(:venue) { FactoryGirl.create(:venue) }
  let(:json_result) { JSON.parse(described_class.new(venue).to_json) }

  specify 'should render json' do
    expect(json_result).to eq({
      "id" => venue.id,
      "name" => venue.name,
      "venueType" => venue.venue_type
    })
  end
end
