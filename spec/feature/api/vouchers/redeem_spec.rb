require 'rails_helper'

RSpec.describe 'Voucher redeem endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:creator) { user }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.redeem_api_v1_voucher_path(
      id: voucher_id
    )
  end
  let(:response) do
    post(url, params)
  end
  let(:perform_call) { response }
  let(:valid_params) do
    {
      "staffMemberId" => staff_member.id
    }
  end
  let(:existing_voucher) { FactoryGirl.create(:voucher, venue: venue) }

  before do
    existing_voucher
    set_authorization_header(access_token.token)
  end

  context 'before call' do
    specify 'no voucher usages exist' do
      expect(VoucherUsage.count).to eq(0)
    end
  end

  context 'with valid params' do
    let(:params) { valid_params }
    let(:voucher_id) { existing_voucher.id }

    specify 'should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'should return empty json' do
      response_json = JSON.parse(response.body)
      expect(response_json).to eq({})
    end

    specify 'should create a voucher usage' do
      perform_call
      expect(VoucherUsage.count).to eq(1)
      created_usage = VoucherUsage.first
      expect(created_usage.creator).to eq(user)
      expect(created_usage.voucher).to eq(existing_voucher)
      expect(created_usage.staff_member).to eq(staff_member)
      expect(created_usage.enabled).to eq(true)
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
