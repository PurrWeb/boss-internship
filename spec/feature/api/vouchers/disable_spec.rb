require 'rails_helper'

RSpec.describe 'Voucher disable endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:creator) { user }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:params) do
    {}
  end
  let(:existing_voucher) { FactoryGirl.create(:voucher, venue: venue) }
  let(:url) do
    url_helpers.api_v1_voucher_path(id: voucher_id)
  end

  before do
    set_authorization_header(access_token.token)
    existing_voucher
  end

  describe "before call" do
    specify '1 voucher should exist' do
      expect(Voucher.count).to eq(1)
      expect(Voucher.first.enabled).to eq(true)
    end
  end

  describe 'call'do
    let(:response) { delete(url) }
    let(:perform_call) { response }

    context 'with valid params' do
      let(:voucher_id) { existing_voucher.id }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should disable voucher' do
        perform_call
        expect(Voucher.count).to eq(1)
        expect(Voucher.first.enabled).to eq(false)
      end
    end

    context 'requesting invalid voucher id' do
      let(:voucher_id) { existing_voucher.id + 1 }

      specify 'should succeed' do
        expect{ response.status }.to raise_error(ActiveRecord::RecordNotFound)
      end

      specify 'should not disable voucher' do
        begin
          perform_call
        rescue; end
        expect(Voucher.count).to eq(1)
        expect(Voucher.first.enabled).to eq(true)
      end
    end

    context 'requesting already disabled voucher id' do
      let(:voucher_id) { existing_voucher.id }

      before do
        existing_voucher.update_attributes!(enabled: false)
      end

      specify 'should succeed' do
        expect{ response.status }.to raise_error(RuntimeError, 'Attempt to disable voucher that is already disabled')
      end
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
end
