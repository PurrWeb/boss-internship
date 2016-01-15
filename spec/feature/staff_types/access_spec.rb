require 'rails_helper'

RSpec.describe 'Staff types pages access' do
  include Rack::Test::Methods

  def app
    Rails.application
  end

  before do
    login_as user if user.present?
  end


  describe 'index page' do
    let(:url) { url_helpers.staff_types_path }

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

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end
  end

  describe 'new staff type page' do
    let(:url) { url_helpers.new_staff_type_path }

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

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end
  end

  describe 'create staff type action' do
    let(:url) { url_helpers.staff_types_path }
    let(:params) do
      { staff_type: { name: 'type_name' } }
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

      specify 'should not have access' do
        expect {
          post(url, params)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should have access' do
        expect(post(url, params).status).to eq(redirect_status)
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