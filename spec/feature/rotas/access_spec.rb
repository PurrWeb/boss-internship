require 'rails_helper'

RSpec.describe 'Rota page access' do
  include Rack::Test::Methods

  before do
    login_as user
  end

  describe 'non existing rota page' do
    let(:venue) { FactoryGirl.create(:venue)}
    let(:url) { url_helpers.venue_rota_path(id: UIRotaDate.format(Time.now), venue_id: venue.id) }

    context 'manager with rites to manage venue' do
      let(:user) { FactoryGirl.create(:user, :admin, venues: [venue]) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end

    context 'manager without rites to manage venue' do
      let(:user) { FactoryGirl.create(:user, :admin) }

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

  describe 'existing Rota page' do
    let(:rota) { FactoryGirl.create(:rota) }
    let(:venue) { rota.venue }
    let(:url) { url_helpers.venue_rota_path(id: UIRotaDate.format(rota.date), venue_id: rota.venue.id) }

    context 'manager with rites to manage venue' do
      let(:user) { FactoryGirl.create(:user, :admin, venues: [venue]) }

      specify 'should have access' do
        expect(get(url).status).to eq(ok_status)
      end
    end

    context 'manager without rites to manage venue' do
      let(:user) { FactoryGirl.create(:user, :admin) }

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

  private
  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def app
    Rails.application
  end
end
