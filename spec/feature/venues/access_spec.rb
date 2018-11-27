require 'rails_helper'

RSpec.describe 'Staff member pages access' do
  include Rack::Test::Methods

  def app
    Rails.application
  end
  let(:default_questionnaire) { Questionnaire.create! }

  before do
    default_questionnaire
    login_as user if user.present?
  end

  describe 'index page' do
    let(:url) { url_helpers.venues_path }

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'ops manager' do
      let(:user) { FactoryGirl.create(:user, :ops_manager) }

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

  describe 'new venue page' do
    let(:url) { url_helpers.new_venue_path }

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'ops manager' do
      let(:user) { FactoryGirl.create(:user, :ops_manager) }

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

  describe 'create venue action' do
    let(:url) { url_helpers.venues_path }
    let(:params) do
      {
        venue: {
          foo: 'bar',
          till_float_cents: 0,
          safe_float_cents: 0
        }
      }
    end

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          post(url, params)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'ops manager' do
      let(:user) { FactoryGirl.create(:user, :ops_manager) }

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
