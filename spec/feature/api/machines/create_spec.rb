require 'rails_helper'

RSpec.describe 'Create machine API endpoint' do
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
    url_helpers.api_v1_machines_path
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      venueId: venue.id,
      name: name,
      location: location,
      floatCents: float_cents,
      initialRefillX10p: initial_refill_x_10p,
      initialCashInX10p: initial_cash_in_x_10p,
      initialCashOutX10p: initial_cash_out_x_10p
    }
  end
  let(:null_params) do
    {
      venueId: nil,
      name: nil,
      location: nil,
      floatCents: nil,
      initialRefillX10p: nil,
      initialCashInX10p: nil,
      initialCashOutX10p: nil
    }
  end
  let(:now) { Time.current.round }
  let(:venue_id) { venue.id }
  let(:location) { "Some where" }
  # Syntatic sugar for tests that
  # don't directly check the reponse
  let(:perform_call) { response }

  context 'before call' do
    specify 'no machines should exist' do
      expect(Machine.count).to eq(0)
    end
  end

  context 'when using null params' do
    let(:params) { null_params }

    specify 'it should 422' do
      expect(response.status).to eq(unprocessible_entity_status)
    end
  end
  
  context 'when using valid params' do
    let(:params) { valid_params }

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should create the machine' do
      perform_call
      expect(Machine.count).to eq(1)
      machine = Machine.first
      expect(machine.venue_id).to eq(venue_id)
      expect(machine.name).to eq(name)
      expect(machine.location).to eq(location)
      expect(machine.float_cents).to eq(float_cents)
      expect(machine.initial_refill_x_10p).to eq(initial_refill_x_10p)
      expect(machine.initial_cash_in_x_10p).to eq(initial_cash_in_x_10p)
      expect(machine.initial_cash_out_x_10p).to eq(initial_cash_out_x_10p)
    end

    specify 'it should create the machine' do
      json_response = JSON.parse(response.body)
      created_machine = Machine.find(Machine.first.id)

      expect(
        json_response
      ).to eq({
        "id" => created_machine.id,
        "venueId" => venue_id,
        "name" => name,
        "location" => location,
        "disabledAt" => nil,
        "createdAt" => created_machine.created_at.iso8601,
        "creatorId" => created_machine.created_by_user.id,
        "floatCents" => float_cents,
        "initialRefillX10p" => initial_refill_x_10p,
        "initialCashInX10p" => initial_cash_in_x_10p,
        "initialCashOutX10p" => initial_cash_out_x_10p,
      })
    end
  end

  context 'validation errors' do
    let(:params) do
      valid_params.merge({
        floatCents: nil,
        initialRefillX10p: -100
      })
    end

    specify 'it should not succeed' do
      expect(response.status).to eq(unprocessible_entity_status)
    end

    specify 'it should not create entity' do
      perform_call
      expect(Machine.count).to eq(0)
    end

    specify 'it should return errors' do
      response_json = JSON.parse(response.body)
      expect(
        response_json
      ).to eq({
        "errors" => {
          "floatCents" => ["can't be blank"],
          "initialRefillX10p" => ["must be positive"]
        }
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
