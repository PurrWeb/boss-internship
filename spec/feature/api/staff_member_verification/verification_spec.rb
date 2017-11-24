require 'rails_helper'

RSpec.describe 'Staff member verification' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:send_verification_url) { url_helpers.api_v1_staff_member_send_verification_path(staff_member) }
  let(:user) { FactoryGirl.create(:user) }
  let(:access_token) do
    WebApiAccessToken.new(
      user: user
    ).persist!
  end

  describe 'send verification' do
    before do
      set_authorization_header(access_token.token)
    end

    context 'unverified staff member' do
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      
      it 'should receive verification email' do
        response = post(send_verification_url)
        expect(response.status).to eq(ok_status)
      end
      
      it 'should be verifiable' do
        response = post(send_verification_url)
        staff_member.reload
        expect(staff_member.verifiable?).to eq(true)
      end

      it 'should have verification token' do
        response = post(send_verification_url)
        staff_member.reload
        expect(staff_member.verification_token).not_to be_nil
        expect(staff_member.verification_sent_at).not_to be_nil
      end
    end

    context 'unverified staff member' do
      let(:staff_member) { FactoryGirl.create(:staff_member, verification_token: 'SomeToken', verification_sent_at: Time.now.utc) }
      
      it 'should receive error' do
        response = post(send_verification_url)
        json = JSON.parse(response.body)
        expect(response.status).to eq(unprocessable_entity_status)
        expect(json["errors"]["base"]).to eq(["Verification already sent"])
      end
    end

    context 'verified staff member' do
      let(:staff_member) { FactoryGirl.create(:staff_member, verified_at: Time.now.utc) }
      
      it 'should receive error' do
        response = post(send_verification_url)
        json = JSON.parse(response.body)
        expect(response.status).to eq(unprocessable_entity_status)
        expect(json["errors"]["base"]).to eq(["Staff member already verified"])
      end
    end
  end

  describe 'reset password' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:reset_password_url) { url_helpers.set_password_api_v1_staff_members_path(params) }

    context 'when supplied token is invalid' do
      let(:params) do
        {
          password: 'some password',
          passwordConfirmation: 'some password',
          verificationToken: 'wrong token'
        }
      end

      it 'should raise error' do
        expect{ post(reset_password_url)}.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'valid params' do
      let(:verification_token) {"validtoken"}
      let(:staff_member) { FactoryGirl.create(:staff_member, verification_token: verification_token, verification_sent_at: Time.now.utc) }
      
      context 'valid password and token params' do
        let(:params) do
          {
            password: 'some password',
            passwordConfirmation: 'some password',
            verificationToken: staff_member.verification_token
          }
        end
  
        it 'should be unverified' do
          expect(staff_member.verified?).to eq(false)
        end
  
        it 'new password should be set' do
          response = post(reset_password_url)
          staff_member.reload
          expect(response.status).to eq(ok_status)
          expect(staff_member.verified?).to eq(true)
        end
      end
      
      context 'empty password and password_confirmation' do
        let(:params) do
          {
            password: '',
            passwordConfirmation: '',
            verificationToken: staff_member.verification_token
          }
        end
    
        it 'should receive validation errors' do
          response = post(reset_password_url)
          json = JSON.parse(response.body)
          expect(response.status).to eq(unprocessable_entity_status)
          expect(json["errors"]["password"]).to eq(["Password field can't be empty"])
          expect(json["errors"]["passwordConfirmation"]).to eq(["Password confirmation field can't be empty"])
        end
      end

      context 'password length less than 6' do
        let(:params) do
          {
            password: 'less',
            passwordConfirmation: 'less',
            verificationToken: staff_member.verification_token
          }
        end
    
        it 'should receive validation errors' do
          response = post(reset_password_url)
          json = JSON.parse(response.body)
          expect(response.status).to eq(unprocessable_entity_status)
          expect(json["errors"]["password"]).to eq(["is too short (minimum is 6 characters)"])
        end
      end

      context "password and password confirmation doesn't match" do
        let(:params) do
          {
            password: 'Pa$$w0rd',
            passwordConfirmation: 'password',
            verificationToken: staff_member.verification_token
          }
        end
    
        it 'should receive validation errors' do
          response = post(reset_password_url)
          json = JSON.parse(response.body)
          expect(response.status).to eq(unprocessable_entity_status)
          expect(json["errors"]["passwordConfirmation"]).to eq(["doesn't match Password"])
        end
      end
    end

    context 'verified staff member' do
      let(:verification_token) {"validtoken"}
      let(:staff_member) { FactoryGirl.create(:staff_member, verification_token: verification_token, verification_sent_at: Time.now.utc) }
      let(:params) do
        {
          password: 'some password',
          passwordConfirmation: 'some password',
          verificationToken: staff_member.verification_token
        }
      end

      before do
        response = post(reset_password_url)
      end

      it 'can not set password on verified staff member' do
        staff_member.reload
        response = post(reset_password_url)
        json = JSON.parse(response.body)
        expect(response.status).to eq(unprocessable_entity_status)
        expect(json["errors"]["base"]).to eq(["Staff member already verified"])
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

  def unprocessable_entity_status
    422
  end

  def unauthorised_status
    401
  end

  def not_found_status
    404
  end
end
