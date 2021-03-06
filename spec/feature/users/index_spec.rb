require 'feature/feature_spec_helper'

RSpec.feature 'Users Section Index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:users_index_page) { PageObject::UsersIndexPage.new }
  let(:invites_index_page) { PageObject::InvitesIndexPage.new }
  let(:user_show_page) { PageObject::UserShowPage.new(dev_user) }

  before do
    login_as(dev_user)
  end

  scenario 'clicking add new user button takes you to the add users page' do
    users_index_page.surf_to
    users_index_page.click_manage_invites_button
    invites_index_page.assert_on_correct_page
  end

  scenario 'users details should be displayed in a table' do
    users_index_page.surf_to
    users_index_page.user_table.ensure_details_displayed_for(dev_user)
  end

  scenario 'clicking on a users details should take you to their show page' do
    PageObject::UsersIndexTable.columns.each do |column|
      users_index_page.surf_to
      users_index_page.user_table.click_on_detail(column, user: dev_user)
      user_show_page.assert_on_correct_page
    end
  end
end
