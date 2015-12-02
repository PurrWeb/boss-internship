require 'feature/feature_spec_helper'

RSpec.feature 'Login' do
  let(:email) { 'joe@blogs.com' }
  let(:password) { '123456789' }
  let(:user) { FactoryGirl.create(:user, :admin, email: email, password: password) }

  context 'for a not logged in user' do
    scenario 'Logging in should take you to the homepage' do
      visit('/')
      fill_in('Email', with: user.email)
      fill_in('Password', with: password)
      click_button('Sign in')
      expect(page).to have_content('Welcome')
    end
  end
end
