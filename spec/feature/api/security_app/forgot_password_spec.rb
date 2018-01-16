require 'rails_helper'

RSpec.describe 'Forgot password endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:url) { url_helpers.forgot_password_api_security_app_v1_sessions_path }
  let(:response) { post(url, params) }
  let(:perform_request) { response }
  let(:staff_member_email) { 'forgotten.password@fake.com' }
  let(:email) { staff_member.email}
  let(:email_address_record) { EmailAddress.create!(email: staff_member_email) }
  let(:staff_member) { FactoryGirl.create(:staff_member, :with_password, email_address: email_address_record) }
  let(:params) do
    {
      email: email
    }
  end

  it 'returns ok status' do
    expect(response.status).to eq(ok_status)
  end

  it 'returns any empty json response in the body' do
    json_response = JSON.parse(response.body)
    expect(json_response).to eq({})
  end

  it 'sends a password reset email' do
    expect(ActionMailer::Base.deliveries.count).to eq(0)
    perform_request
    expect(ActionMailer::Base.deliveries.count).to eq(1)
    mail = ActionMailer::Base.deliveries.last

    expect(mail.subject).to eq("Reset your JSM Bars Password")
    expect(mail.to).to eq([email])
  end

  context 'email supplied is invalid' do
    let(:email) { 'non_existant@fake.co.uk' }
    it 'returns ok status' do
      expect(response.status).to eq(ok_status)
    end

    it 'returns any empty json response in the body' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({})
    end

    it 'should not send a reset email' do
      expect(ActionMailer::Base.deliveries.count).to eq(0)
      perform_request
      expect(ActionMailer::Base.deliveries.count).to eq(0)
    end

    it 'should log attempt to rollbar' do
      expect(Rollbar).to receive(:warning).with("Reset attempt for invalid email address #{email}")
      perform_request
    end
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
end
