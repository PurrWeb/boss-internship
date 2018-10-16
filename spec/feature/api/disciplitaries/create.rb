require 'rails_helper'

RSpec.describe 'Create disciplinaties API endpoint' do
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
  let(:url) do
    url_helpers.api_v1_staff_member_disciplinaries_path(staff_member)
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      title: 'Title',
      level: 'first_level',
      conduct: 'conduct',
      nature: 'nature',
      consequence: 'consequence',
    }
  end

  describe 'before call' do
    it 'no disciplinaries should exist' do
      expect(staff_member.disciplinaries.count).to eq(0)
    end
  end

  describe 'create disciplinary with valid params' do
    let(:params) { valid_params }
    before do
      response
    end

    it 'should be ok status' do
      expect(response.status).to eq(ok_status)
    end
    it 'should create disciplinary' do
      expect(staff_member.disciplinaries.count).to eq(1)
    end
    it 'should return created disciplinary' do
      json = JSON.parse(response.body)
      disciplinary = staff_member.disciplinaries.first
      expect(json["disciplinary"]["id"]).to eq(disciplinary.id)
      expect(json["disciplinary"]["title"]).to eq(disciplinary.title)
      expect(json["disciplinary"]["conduct"]).to eq(disciplinary.conduct)
      expect(json["disciplinary"]["nature"]).to eq(disciplinary.nature)
      expect(json["disciplinary"]["consequence"]).to eq(disciplinary.consequence)
      expect(json["disciplinary"]["createdAt"]).to eq(disciplinary.created_at.iso8601)
      expect(json["disciplinary"]["expiredAt"]).to eq(disciplinary.expired_at.iso8601)
      expect(json["disciplinary"]["createdByUser"]).to eq(user.full_name)
      expect(json["disciplinary"]["disabledByUser"]).to eq(nil)
      expect(json["disciplinary"]["disabledAt"]).to eq(nil)
    end
  end

  describe 'create disciplinary with invalid params' do
    let(:params) do
      valid_params.merge({
        title: nil,
        conduct: nil,
        nature: nil,
        consequence: nil,
        level: nil
      })
    end
    before do
      response
    end

    it 'should be 422 status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end
    it 'should not create disciplinary' do
      expect(staff_member.disciplinaries.count).to eq(0)
    end
    it 'should return disciplinary validation errors' do
      json = JSON.parse(response.body)
      errors = json["errors"];
      expect(errors["title"]).to eq(["can't be blank"])
      expect(errors["conduct"]).to eq(["can't be blank"])
      expect(errors["nature"]).to eq(["can't be blank"])
      expect(errors["consequence"]).to eq(["can't be blank"])
      expect(errors["level"]).to eq(["is invalid", "can't be blank"])
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
