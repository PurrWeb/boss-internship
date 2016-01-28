require 'rails_helper'

RSpec.describe 'Rota page access' do
  include Rack::Test::Methods

  def app
    Rails.application
  end

  describe 'empty Rota demo page' do
    let(:url) { url_helpers.empty_example_rotas_path }

    specify 'should be accessible for all users' do
      [:manager, :admin, :dev].each do |role|
        user = FactoryGirl.create(:user, role)
        login_as user
        expect(get(url).status).to eq(ok_status)
      end
    end
  end

  describe 'pre filled Rota demo page' do
    let(:url) { url_helpers.prefilled_example_rotas_path }

    specify 'should be accessible for all users' do
      [:manager, :admin, :dev].each do |role|
        user = FactoryGirl.create(:user, role)
        login_as user
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
end
