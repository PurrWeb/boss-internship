require 'rails_helper'

RSpec.describe 'Enable machine API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:venue_id) { venue.id }
  let(:name) { "Some where" }
  let(:location) { "Some where" }
  let(:float_cents) { 40000 }
  let(:initial_refill_x_10p) { 400000 }
  let(:initial_cash_in_x_10p) { 405000 }
  let(:initial_cash_out_x_10p) { 205000 }
  let(:disabled_machine) do
    FactoryGirl.create(
      :machine,
      venue: venue,
      created_by_user: user,
      disabled_by: user,
      disabled_at: Time.now
    )
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  before do
    set_authorization_header(access_token.token)
  end
  let(:url) do
    url_helpers.restore_api_v1_machine_path(disabled_machine)
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      venueId: venue.id,
      name: name,
      location: location,
      initialRefillX10p: initial_refill_x_10p,
      initialCashInX10p: initial_cash_in_x_10p,
      initialCashOutX10p: initial_cash_out_x_10p
    }
  end
  let(:now) { Time.current.round }
  let(:venue_id) { venue.id }
  let(:location) { "Some where" }
  # Syntatic sugar for tests that
  # don't directly check the reponse
  let(:perform_call) { response }

  before do
    disabled_machine
    set_authorization_header(access_token.token)
  end

  context 'before call' do
    specify '0 machines should exist' do
      expect(Machine.count).to eq(1)
      expect(Machine.enabled.count).to eq(0)
    end
  end

  context 'when using valid params' do
    let(:params) { valid_params }

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should enable the machine' do
      perform_call
      expect(Machine.count).to eq(1)
      expect(Machine.enabled.count).to eq(1)
    end

    specify 'it should return machine json' do
      json_response = JSON.parse(response.body)
      disabled_machine.reload
      machine = Machine.first
      expect(
        json_response
      ).to eq({
        "id" => disabled_machine.id,
        "venueId" => venue_id,
        "name" => machine.name,
        "location" => machine.location,
        "disabledAt" => nil,
        "createdAt" => machine.created_at.iso8601,
        "creatorId" => machine.created_by_user.id,
        "floatCents" => disabled_machine.float_cents,
        "initialFloatTopupCents" => machine.initial_float_topup_cents,
        "initialRefillX10p" => machine.initial_refill_x_10p,
        "initialCashInX10p" => machine.initial_cash_in_x_10p,
        "initialCashOutX10p" => machine.initial_cash_out_x_10p,
        "totalBankedCents" => machine.total_banked_cents
      })
    end
  end

  private
  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def unprocessible_entity_status
    422
  end

  def unauthorised_status
    401
  end
end



