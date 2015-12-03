
require 'feature/feature_spec_helper'

RSpec.feature 'Users Section Index page' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:users_index_page) { UsersIndexPage.new }
  let(:add_user_page) { AddUserPage.new }

  before do
    login_as(admin_user)
  end

  scenario 'the users section should be highlighted in the navigaiton' do
    users_index_page.surf_to
    users_index_page.navigation.ensure_only_sections_highlighted(:users)
  end


  scenario 'clicking add new user button takes you to the add users page' do
    users_index_page.surf_to
    users_index_page.click_add_user_button
    add_user_page.assert_on_correct_page
  end
end
