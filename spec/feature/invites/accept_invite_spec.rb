require 'feature/feature_spec_helper'

RSpec.feature 'Accepting an invite' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:invite) { FactoryGirl.create(:invite, :admin, inviter: admin_user) }
  let(:prospective_user) { FactoryGirl.build(:user) }
  let(:accept_invite_page) { AcceptInvitePage.new(invite) }
  let(:sign_in_page) { SignInPage.new }
  let(:home_page) { HomePage.new }

  scenario 'Anonymous user clicks on accept invite link in email and fills out form' do
    accept_invite_page.surf_to

    accept_invite_page.ensure_sign_up_text_displayed
    accept_invite_page.user_form.tap do |user_form|
      user_form.fill_in_for(prospective_user)
      user_form.submit
    end

    home_page.ensure_welcome_text_displayed_for(prospective_user)
    expect(invite.reload).to be_accepted
    expect(User.joins(:email_address).merge(EmailAddress.where(email: invite.email)).first).to be_present
  end

  context 'Invite has already been accepted' do
    let(:invite) { FactoryGirl.create(:invite, :admin, :accepted, inviter: admin_user) }

    scenario 'Attempting to accept an already accepted invite' do
      accept_invite_page.surf_to
      sign_in_page.ensure_flash_warning_message_displayed('The invite has already been used please sign in to continue')
    end
  end
end
