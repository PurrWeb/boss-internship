require 'rails_helper'

RSpec.describe 'Show disciplinaties API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end

  let(:user) { FactoryGirl.create(:user, :ops_manager) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let!(:disciplinary) { FactoryGirl.create(:disciplinary, staff_member: staff_member, created_by_user: user) }
  let!(:disabled_disciplinary) do
    FactoryGirl.create(:disciplinary,
      staff_member: staff_member,
      created_by_user: user,
      disabled_by_user: user,
      disabled_at: Time.zone.now
    )
  end

  let!(:expired_disciplinary) do
    FactoryGirl.create(:disciplinary,
      staff_member: staff_member,
      created_by_user: user,
      created_at: Time.zone.now - (Disciplinary::EXPIRATION_LIMIT + 1.day),
    )
  end

  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_staff_member_disciplinaries_path(staff_member)
  end
  let(:response) do
    get(url, params)
  end

  describe 'show disciplinaries without filter' do
    let(:params) { {} }
    before do
      response
    end

    it 'should be ok status' do
      expect(response.status).to eq(ok_status)
    end
    it 'should return one disciplinary' do
      json = JSON.parse(response.body)
      disciplinaries = json["disciplinaries"]
      expect(disciplinaries.count).to eq(1)
    end
    it 'should return expected filter' do
      json = JSON.parse(response.body)
      filter = json["filter"]
      expect(filter).to eq({"start_date"=>nil, "end_date"=>nil, "show_expired"=>false, "show_disabled"=>false})
    end
  end

  describe 'show disciplinaries with show_expired filter' do
    let(:params) { { show: ['expired'] } }
    before do
      response
    end

    it 'should be ok status' do
      expect(response.status).to eq(ok_status)
    end
    it 'should return 2 disciplinary' do
      json = JSON.parse(response.body)
      disciplinaries = json["disciplinaries"]
      expect(disciplinaries.count).to eq(2)
    end
    it 'should return expected filter' do
      json = JSON.parse(response.body)
      filter = json["filter"]
      expect(filter).to eq({"start_date"=>nil, "end_date"=>nil, "show_expired"=>true, "show_disabled"=>false})
    end
  end

  describe 'show disciplinaries with show_disabled filter' do
    let(:params) { { show: ['disabled'] } }
    before do
      response
    end

    it 'should be ok status' do
      expect(response.status).to eq(ok_status)
    end
    it 'should return 2 disciplinary' do
      json = JSON.parse(response.body)
      disciplinaries = json["disciplinaries"]
      expect(disciplinaries.count).to eq(2)
    end
    it 'should return expected filter' do
      json = JSON.parse(response.body)
      filter = json["filter"]
      expect(filter).to eq({"start_date"=>nil, "end_date"=>nil, "show_expired"=>false, "show_disabled"=>true})
    end
  end

  describe 'show disciplinaries with show_disabled & show_expired filters' do
    let(:params) { { show: ['disabled', 'expired'] } }
    before do
      response
    end

    it 'should be ok status' do
      expect(response.status).to eq(ok_status)
    end
    it 'should return 3 disciplinary' do
      json = JSON.parse(response.body)
      disciplinaries = json["disciplinaries"]
      expect(disciplinaries.count).to eq(3)
    end
    it 'should return expected filter' do
      json = JSON.parse(response.body)
      filter = json["filter"]
      expect(filter).to eq({"start_date"=>nil, "end_date"=>nil, "show_expired"=>true, "show_disabled"=>true})
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

  def unprocessable_entity_status
    422
  end
end
