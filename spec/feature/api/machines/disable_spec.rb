require 'rails_helper'

RSpec.describe 'Disable machine API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:venue_id) { venue.id }
  let(:existing_machine) do
    FactoryGirl.create(
      :machine,
      venue: venue,
      created_by_user: user,
      disabled_by: nil
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
    url_helpers.api_v1_machine_path(existing_machine)
  end
  let(:response) do
    delete(url, params)
  end
  let(:valid_params) do
    {
      venueId: venue.id,
    }
  end
  let(:now) { Time.current.round }
  let(:venue_id) { venue.id }
  let(:location) { "Some where" }
  # Syntatic sugar for tests that
  # don't directly check the reponse
  let(:perform_call) { response }

  before do
    existing_machine
    set_authorization_header(access_token.token)
  end

  context 'before call' do
    specify '1 machine should exist' do
      expect(Machine.count).to eq(1)
      expect(Machine.enabled.count).to eq(1)
    end
  end

  context 'when using valid params' do
    let(:params) { valid_params }

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should disable the machine' do
      perform_call
      expect(Machine.count).to eq(1)
      expect(Machine.enabled.count).to eq(0)
    end

    specify 'it should return machine json' do
      json_response = JSON.parse(response.body)
      existing_machine.reload
      machine = Machine.first
      expect(
        json_response
      ).to eq({
        "id" => existing_machine.id,
        "venueId" => venue_id,
        "name" => existing_machine.name,
        "location" => existing_machine.location,
        "disabledAt" => machine.disabled_at.iso8601,
        "createdAt" => existing_machine.created_at.iso8601,
        "creatorId" => existing_machine.created_by_user.id,
        "floatCents" => existing_machine.float_cents,
        "initialFloatTopupCents" => existing_machine.initial_float_topup_cents,
        "initialRefillX10p" => existing_machine.initial_refill_x_10p,
        "initialCashInX10p" => existing_machine.initial_cash_in_x_10p,
        "initialCashOutX10p" => existing_machine.initial_cash_out_x_10p,
        "totalBankedCents" => existing_machine.total_banked_cents
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



