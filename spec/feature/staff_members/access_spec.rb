require 'rails_helper'

RSpec.describe 'Staff member pages access' do
  include Rack::Test::Methods

  def app
    Rails.application
  end

  before do
    login_as user if user.present?
  end

  describe 'index page' do
    let(:url) { url_helpers.staff_members_path }

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end

    context 'ops manager' do
      let(:user) { FactoryGirl.create(:user, :ops_manager) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
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

  describe 'show page' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:url) { url_helpers.staff_member_path(staff_member, tab: 'employment-details') }

    context 'manager without access to members venue' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should not have access' do
        expect {
          get(url)
        }.to raise_error(CanCan::AccessDenied)
      end
    end

    context 'manager with access to members venue' do
      let(:user) { FactoryGirl.create(:user, :manager, venues: [staff_member.venue]) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end

    context 'ops manager' do
      let(:user) { FactoryGirl.create(:user, :ops_manager) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
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

  describe 'new staff member page' do
    let(:url) { url_helpers.new_staff_member_path }

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end

    context 'ops manager' do
      let(:user) { FactoryGirl.create(:user, :ops_manager) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
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

  describe 'create staff member (action)' do
    let(:url) { url_helpers.staff_members_path }
    let(:params) do
      {
        staff_member: { pin_number: '332432324' }
      }
    end

    context 'manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }

      specify 'should have access' do
        expect(post(url, params).status).to eq(ok_status)
      end
    end

    context 'ops manager' do
      let(:user) { FactoryGirl.create(:user, :ops_manager) }

      specify 'should have access' do
        expect(post(url, params).status).to eq(ok_status)
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
end
