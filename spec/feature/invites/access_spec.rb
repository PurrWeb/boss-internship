require 'rails_helper'

RSpec.describe 'Invite pages access' do
  include Rack::Test::Methods

  def app
    Rails.application
  end

  before do
    login_as user if user.present?
  end

  describe 'index page' do
    let(:url) { url_helpers.invites_path }

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'admin' do
      let(:user) { FactoryGirl.create(:user, :admin) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end
  end

  describe 'new invite page' do
    let(:url) { url_helpers.new_invite_path }

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'admin' do
      let(:user) { FactoryGirl.create(:user, :admin) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end
  end

  describe 'invite creation page' do
    let(:url) { url_helpers.invites_path }
    let(:params) do
      { invite: { email: 'fake@fake.com' } }
    end

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          post(url, params)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'admin' do
      let(:user) { FactoryGirl.create(:user, :admin) }

      specify 'should have access' do
        expect(post(url, params).status).to eq(ok_status)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should have access' do
        expect(post(url, params).status).to eq(ok_status)
      end
    end
  end

  describe 'accept invite landing page' do
    let(:user) { nil }
    let(:invite) { FactoryGirl.create(:invite) }
    let(:url) { url_helpers.accept_invite_path(invite.token) }

    specify 'any user should have access' do
      expect(get(url).status).to eq(ok_status)
    end
  end

  describe 'accept invite page (action)' do
    let(:user) { nil }
    let(:invite) { FactoryGirl.create(:invite) }
    let(:url) { url_helpers.accept_invite_path(invite.token) }
    let(:params) do
      { user: { password: 'user_password' } }
    end

    specify 'any user should have access' do
      expect(post(url, params).status).to eq(ok_status)
    end
  end

  describe 'rovoking invite' do
    let(:invite) { FactoryGirl.create(:invite) }
    let(:url) { url_helpers.revoke_invite_path(invite) }
    let(:params) do
      { invite: { email: 'fake@fake.com' } }
    end

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should be restricted' do
        expect {
          post(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'admin' do
      let(:user) { FactoryGirl.create(:user, :admin) }

      specify 'should be able' do
        expect(post(url).status).to eq(302)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should be able' do
        expect(post(url).status).to eq(302)
      end
    end
  end

  private
  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def redirect_status
    302
  end
end
