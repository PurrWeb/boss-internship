require 'feature/feature_spec_helper'

RSpec.feature 'Sign in' do
  let(:password) { '123456789' }
  let(:user) { FactoryGirl.create(:user, :admin, password: password) }

  let(:sign_in_page) { PageObject::SignInPage.new }
  let(:home_page) { PageObject::HomePage.new }

  context 'for a not logged in user' do
    scenario 'Logging in should take you to the homepage' do
      visit('/')
      sign_in_page.sign_in(email: user.email, password: password)

      home_page.assert_on_correct_page
    end
  end
end
