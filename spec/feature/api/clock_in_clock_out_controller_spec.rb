require 'rails_helper'

RSpec.describe 'Clock in clock out endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:params) do
    { api_key: api_key.key }
  end
  let(:url) { url_helpers.api_v1_clock_in_clock_out_index_path }
  let(:response) { get(url, params) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:api_key) do
    ApiKey.create!(venue: venue, user: user, key_type: ApiKey::BOSS_KEY_TYPE)
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }

  specify 'should succeed' do
    expect(response.status).to eq(ok_status)
  end

  specify 'should return a json representation' do
    now = Time.current
    json = JSON.parse(response.body)
    expect(json.keys).to eq([
      "id",
      "staff_members",
      "clock_in_days",
      "clock_in_notes",
      "staff_types",
      "rota_shifts",
      "venues",
      "rotas",
      "page_data"
    ])
    expect(json["page_data"]).to eq(
      "rota_date" => RotaShiftDate.to_rota_date(now).iso8601,
      "rota_venue_id" => venue.id
    )
  end

  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def unprocessable_entity_status
    422
  end
end
