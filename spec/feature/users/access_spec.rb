require 'rails_helper'

RSpec.describe 'Staff member pages access' do
  include Rack::Test::Methods

  def app
    Rails.application
  end

  before do
    login_as user if user.present?
  end

  describe 'show page' do
    let(:user) { FactoryGirl.create(:user) }
    let(:url) { url_helpers.user_path(user) }

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

  describe 'index page' do
    let(:url) { url_helpers.users_path }

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

  describe 'edit personal details page' do
    let(:user) { FactoryGirl.create(:user) }
    let(:url) { url_helpers.edit_personal_details_user_path(user) }

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'manager' do
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

  describe 'update personal details action' do
    let(:user) { FactoryGirl.create(:user) }
    let(:url) { url_helpers.update_personal_details_user_path(user) }
    let(:params) do
      { user: { name: 'name' } }
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
        expect(post(url, params).status).to eq(redirect_status)
      end
    end

    context 'dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }

      specify 'should have access' do
        expect(post(url, params).status).to eq(redirect_status)
      end
    end
  end

  describe 'new staff member for user page' do
    let(:url) { url_helpers.new_staff_member_user_path(target_user) }
    let(:target_user) { FactoryGirl.create(:user, :manager)}

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

  describe 'create staff member for user action' do
    let(:url) { url_helpers.create_staff_member_user_path(target_user) }
    let(:target_user) { FactoryGirl.create(:user, :manager)}
    let(:params) do
      { staff_member: { foo: 'bar' } }
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
