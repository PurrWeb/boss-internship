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
        navigation.ensure_sections_only_appear(:brand)
      end
    end

    context 'a logged in admin user' do
      let(:user) { FactoryGirl.create(:user, :admin, email: email, password: password) }
      let(:home_page) { HomePage.new }

      scenario 'sees extra functionality' do
        login_as(user)

        home_page.surf_to
        home_page.navigation.tap do |navigation|
          navigation.ensure_sections_only_appear(:brand, :user)
          navigation.ensure_login_details_displayed_in_user_section(user)
          navigation.ensure_logout_link_displayed_in_user_section
        end
      end
    end
  end
end
