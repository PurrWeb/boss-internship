require 'rails_helper'

RSpec.describe 'Clock in clock out endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:url) { url_helpers.api_v1_clock_in_clock_out_index_path }
  let(:response) { get(url) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:api_key) do
    ApiKey.create!(venue: venue, user: user)
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:staff_member) do
    FactoryGirl.create(:staff_member)
  end
  let(:access_token) do
    AccessToken.create!(
      token_type: 'api',
      expires_at: 30.minutes.from_now,
      creator: user,
      api_key: api_key,
      staff_member: staff_member
    )
  end

  before do
    set_token_header(access_token)
  end

  specify 'should succeed' do
    expect(response.status).to eq(ok_status)
  end

  specify 'should return a json representation' do
    now = Time.current
    json = JSON.parse(response.body)
    expect(json.keys).to eq([
      "staff_members",
      "clock_in_statuses",
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
