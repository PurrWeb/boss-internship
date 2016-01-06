require 'feature/feature_spec_helper'

RSpec.feature 'Navigation Bar' do
  let(:sign_in_page) { SignInPage.new }

  context 'a not logged in user' do
    scenario 'sees the default navbar' do
      sign_in_page.surf_to
      sign_in_page.assert_on_correct_page

      sign_in_page.navigation.tap do |navigation|
        navigation.ensure_branding_displayed
        navigation.ensure_top_level_sections_displayed(*[])
        navigation.ensure_user_section_not_displayed
      end
    end

    context 'a logged in dev' do
      let(:user) { FactoryGirl.create(:user, :dev) }
      let(:home_page) { HomePage.new }

      scenario 'sees the correct sections' do
        login_as(user)

        home_page.surf_to
        home_page.navigation.tap do |navigation|
          navigation.ensure_branding_displayed
          navigation.ensure_top_level_sections_displayed(:staff_members, :rota, :admin)
          navigation.ensure_admin_sections_displayed(:users, :venues, :staff_types)
          navigation.ensure_user_section_displayed_for(user)
        end
      end
    end

    context 'a logged in admin' do
      let(:user) { FactoryGirl.create(:user, :admin) }
      let(:home_page) { HomePage.new }

      scenario 'sees the correct sections' do
        login_as(user)

        home_page.surf_to
        home_page.navigation.tap do |navigation|
          navigation.ensure_branding_displayed
          navigation.ensure_top_level_sections_displayed(:rota, :admin)
          navigation.ensure_admin_sections_displayed(:users)
          navigation.ensure_user_section_displayed_for(user)
        end
      end
    end

    context 'a logged in manager' do
      let(:user) { FactoryGirl.create(:user, :manager) }
      let(:home_page) { HomePage.new }

      scenario 'sees the rota section' do
        login_as(user)

        home_page.surf_to
        home_page.navigation.tap do |navigation|
          navigation.ensure_branding_displayed
          navigation.ensure_top_level_sections_displayed(:rota)
          navigation.ensure_user_section_displayed_for(user)
        end
      end
    end
  end
end
