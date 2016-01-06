require 'feature/feature_spec_helper'

RSpec.feature 'Invites index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:prospective_invite) { FactoryGirl.build(:invite) }
  let(:invites_index_page) { InvitesIndexPage.new }
  let(:invite_new_user_page) { InviteNewUserPage.new }

  before do
    login_as dev_user
  end

  scenario 'the users section should be highlighted in the navigaiton' do
    invites_index_page.surf_to
    invites_index_page.navigation.ensure_top_level_sections_highlighted(:admin)
  end

  scenario 'clicking invite new user should take you to the invite new user page' do
    invites_index_page.surf_to
    invites_index_page.click_invite_new_user_button
    invite_new_user_page.assert_on_correct_page
  end

  context 'when invited users exist' do
    let(:inviter) { FactoryGirl.create(:user, :dev) }
    let(:invite) { FactoryGirl.create(:invite, inviter: inviter) }

    before do
      invite
    end

    scenario 'the users details should be displayed in a table' do
      invites_index_page.surf_to
      invites_index_page.invites_table.ensure_details_displayed_for(invite)
    end
  end
end
