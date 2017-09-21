require 'rails_helper'

RSpec.describe 'Create machine API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:venue_id) { venue.id }
  let(:old_name) { "Some old name" }
  let(:old_location) { "Some old location" }
  let(:new_name) { "Some new name" }
  let(:new_location) { "Some new location" }
  let(:old_float_cents) { 40000 }
  let(:old_initial_refill_x_10p) { 400000 }
  let(:old_initial_cash_in_x_10p) { 405000 }
  let(:old_initial_cash_out_x_10p) { 205000 }
  let(:existing_machine) do
    FactoryGirl.create(
      :machine,
      venue: venue,
      created_by_user: user,
      disabled_by: nil,
      name: old_name,
      location: old_location,
      float_cents: old_float_cents,
      initial_refill_x_10p: old_initial_refill_x_10p,
      initial_cash_in_x_10p: old_initial_cash_in_x_10p,
      initial_cash_out_x_10p: old_initial_cash_out_x_10p
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
    existing_machine
    set_authorization_header(access_token.token)
  end
  let(:url) do
    url_helpers.api_v1_machine_path(existing_machine)
  end
  let(:response) do
    put(url, params)
  end
  let(:valid_params) do
    {
      venueId: venue.id,
      name: new_name,
      location: new_location,
    }
  end
  let(:null_params) do
    {
      venueId: venue.id,
      name: nil,
      location: nil,
    }
  end
  # Syntatic sugar for tests that
  # don't directly check the reponse
  let(:perform_call) { response }

  context 'before call' do
    specify '1 machine should exist' do
      expect(Machine.count).to eq(1)
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

    specify 'it should update the machine' do
      perform_call
      machine = Machine.first
      expect(machine.name).to eq(new_name)
      expect(machine.location).to eq(new_location)
      expect(machine.float_cents).to eq(old_float_cents)
      expect(machine.initial_refill_x_10p).to eq(old_initial_refill_x_10p)
      expect(machine.initial_cash_in_x_10p).to eq(old_initial_cash_in_x_10p)
      expect(machine.initial_cash_out_x_10p).to eq(old_initial_cash_out_x_10p)
    end

    specify 'it update create the machine' do
      json_response = JSON.parse(response.body)
      updated_machine = Machine.find(Machine.first.id)

      expect(
        json_response
      ).to eq({
        "id" => updated_machine.id,
        "venueId" => venue_id,
        "name" => new_name,
        "location" => new_location,
        "disabledAt" => nil,
        "createdAt" => updated_machine.created_at.iso8601,
        "creatorId" => updated_machine.created_by_user.id,
        "floatCents" => old_float_cents,
        "initialRefillX10p" => old_initial_refill_x_10p,
        "initialCashInX10p" => old_initial_cash_in_x_10p,
        "initialCashOutX10p" => old_initial_cash_out_x_10p,
      })
    end
  end

  context 'validation errors' do
    let(:params) do
      valid_params.merge({
        name: nil,
        location: nil
      })
    end

    specify 'it should not succeed' do
      expect(response.status).to eq(unprocessible_entity_status)
    end

    specify 'it should return errors' do
      response_json = JSON.parse(response.body)
      expect(
        response_json
      ).to eq({
        "errors" => {
          "name" => ["can't be blank"],
          "location" => ["can't be blank"]
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
