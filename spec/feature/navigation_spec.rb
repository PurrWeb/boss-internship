require 'feature/feature_spec_helper'

RSpec.feature 'Navigation Bar' do
  let(:email) { 'joe@blogs.com' }
  let(:password) { '123456789' }
  let(:sign_in_page) { SignInPage.new }

  context 'a not logged in user' do
    scenario 'sees the default navbar' do
      sign_in_page.surf_to
      sign_in_page.assert_on_correct_page

      sign_in_page.navigation.tap do |navigation|
        navigation.ensure_branding_displayed
        navigation.ensure_only_sections_displayed(*[])
        navigation.ensure_user_section_not_displayed
      end
    end

    context 'a logged in admin user' do
      let(:user) { FactoryGirl.create(:user, :admin, email: email, password: password) }
      let(:home_page) { HomePage.new }

      scenario 'sees extra functionality' do
        login_as(user)

        home_page.surf_to
        home_page.navigation.tap do |navigation|
          navigation.ensure_branding_displayed
          navigation.ensure_only_sections_displayed(*[])
          navigation.ensure_user_section_displayed_for(user)
        end
      end
    end
  end
end
