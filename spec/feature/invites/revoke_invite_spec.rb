require 'feature/feature_spec_helper'

RSpec.feature 'Revoking an invite' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:invite) { FactoryGirl.create(:invite, :admin, inviter: admin_user) }
  let(:prospective_user) { FactoryGirl.build(:user) }
  let(:invites_index_page) { PageObject::InvitesIndexPage.new }
  let(:sign_in_page) { PageObject::SignInPage.new }
  let(:home_page) { PageObject::HomePage.new }

  before do
    invite
    login_as(admin_user)
  end

  scenario '' do
    invites_index_page.surf_to

    invites_index_page.invites_table.revoke_invite(invite)

    invites_index_page.ensure_flash_success_message_displayed('The invite was sucessfully revoked')
    expect(invite.reload).to be_revoked
  end

  context 'Invite has aleady been revoked' do
    let(:invite) { FactoryGirl.create(:invite, :admin, :revoked, inviter: admin_user) }

    scenario 'Attempting to revoke an anready revoked invite' do
      invites_index_page.surf_to
      invites_index_page.filter.filter_by_status(:revoked)

      invites_index_page.invites_table.ensure_revoke_button_not_displayed_for(invite)
    end
  end

  context 'Invite has been accepted' do
    let(:invite) { FactoryGirl.create(:invite, :admin, :accepted, inviter: admin_user) }

    scenario 'Attempting to revoke an accepted invite' do
      invites_index_page.surf_to
      invites_index_page.filter.filter_by_status(:accepted)

      invites_index_page.invites_table.ensure_revoke_button_not_displayed_for(invite)
    end
  end
end
