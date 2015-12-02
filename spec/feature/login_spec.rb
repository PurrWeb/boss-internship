require 'feature/feature_spec_helper'

RSpec.feature 'Login' do
  let(:email) { 'joe@blogs.com' }
  let(:password) { '123456789' }
  let(:user) { FactoryGirl.create(:user, :admin, email: email, password: password) }

  let(:login_page) { LoginPage.new }
  let(:home_page) { HomePage.new }

  context 'for a not logged in user' do
    scenario 'Logging in should take you to the homepage' do
      visit('/')
      login_page.sign_in(email: user.email, password: password)

      home_page.assert_on_correct_page
    end
  end
end
