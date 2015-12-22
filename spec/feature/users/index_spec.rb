require 'feature/feature_spec_helper'

RSpec.feature 'Users Section Index page' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:users_index_page) { UsersIndexPage.new }
  let(:invites_index_page) { InvitesIndexPage.new }
  let(:user_show_page) { UserShowPage.new(admin_user) }

  before do
    login_as(admin_user)
  end

  scenario 'the users section should be highlighted in the navigaiton' do
    users_index_page.surf_to
    users_index_page.navigation.ensure_only_sections_highlighted(:users)
  end


  scenario 'clicking add new user button takes you to the add users page' do
    users_index_page.surf_to
    users_index_page.click_manage_invites_button
    invites_index_page.assert_on_correct_page
  end

  scenario 'users details should be displayed in a table' do
    users_index_page.surf_to
    users_index_page.user_table.ensure_details_displayed_for(admin_user)
  end

  scenario 'clicking on a users details should take you to their show page' do
    UsersIndexTable.columns.each do |column|
      users_index_page.surf_to
      users_index_page.user_table.click_on_detail(column, user: admin_user)
      user_show_page.assert_on_correct_page
    end
  end
end
