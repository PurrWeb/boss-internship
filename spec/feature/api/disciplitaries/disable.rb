require 'rails_helper'

RSpec.describe 'Disable disciplinaties API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end

  let(:user) { FactoryGirl.create(:user, :ops_manager) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let!(:disciplinary) { FactoryGirl.create(:disciplinary, staff_member: staff_member, created_by_user: user) }
  let(:url) do
    url_helpers.api_v1_staff_member_disciplinary_path(staff_member, disciplinary)
  end
  let(:response) do
    delete(url)
  end

  describe 'before call' do
    it 'one disciplinary should exist' do
      expect(staff_member.disciplinaries.count).to eq(1)
    end
  end

  describe 'disable disciplinary' do
    before do
      response
    end

    it 'should be ok status' do
      expect(response.status).to eq(ok_status)
    end
    it 'should disable disciplinary' do
      expect(staff_member.disciplinaries.count).to eq(1)
    end
    it 'should return disabled disciplinary' do
      json = JSON.parse(response.body)
      disciplinary = staff_member.disciplinaries.first
      expect(json["id"]).to eq(disciplinary.id)
      expect(json["title"]).to eq(disciplinary.title)
      expect(json["note"]).to eq(disciplinary.note)
      expect(json["createdAt"]).to eq(disciplinary.created_at.iso8601)
      expect(json["expiredAt"]).to eq(disciplinary.expired_at.iso8601)
      expect(json["createdByUser"]).to eq(user.full_name)
      expect(json["disabledByUser"]).to eq(user.full_name)
      expect(json["disabledAt"]).to eq(Time.zone.now.iso8601)
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
