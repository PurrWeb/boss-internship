require 'feature/feature_spec_helper'

RSpec.feature 'Accepting an invite' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:invite) { FactoryGirl.create(:invite, :admin, inviter: admin_user, venue_ids: venues.map(&:id)) }
  let(:venues) do
    Array.new(2) { FactoryGirl.create(:venue) }
  end
  let(:prospective_user) { FactoryGirl.build(:user) }
  let(:accept_invite_page) { PageObject::AcceptInvitePage.new(invite) }
  let(:sign_in_page) { PageObject::SignInPage.new }
  let(:venue_dashboard_page) { PageObject::VenueDashboardPage.new }

  scenario 'Anonymous user clicks on accept invite link in email and fills out form' do
    accept_invite_page.surf_to

    accept_invite_page.ensure_sign_up_text_displayed
    accept_invite_page.user_form.tap do |user_form|
      user_form.fill_in_for(prospective_user)
      user_form.submit
    end

    venue_dashboard_page.assert_on_correct_page
    expect(invite.reload).to be_accepted
    user = User.joins(:email_address).merge(EmailAddress.where(email: invite.email)).first
    expect(user).to be_present
    expect(user.venues).to eq(venues)
  end

  scenario 'Anonymous user clicks on accept invite link in email and fills out incorrectly' do
    accept_invite_page.surf_to

    accept_invite_page.ensure_sign_up_text_displayed
    accept_invite_page.user_form.tap do |user_form|
      user_form.fill_in_password(prospective_user.password)
      user_form.submit
    end

    accept_invite_page.ensure_flash_error_message_displayed(
      'There was a problem accepting this invite'
    )
    expect(invite.reload).to_not be_accepted
  end

  context 'Invite has already been accepted' do
    let(:invite) { FactoryGirl.create(:invite, :admin, :accepted, inviter: admin_user) }

    scenario 'Attempting to accept an already accepted invite' do
      accept_invite_page.surf_to
      sign_in_page.ensure_flash_warning_message_displayed('The invite has already been used please sign in to continue')
    end
  end

  context 'Invite has been rejected' do
    let(:invite) { FactoryGirl.create(:invite, :admin, :revoked, inviter: admin_user) }

    scenario 'Attempting to accept a revoked invite' do
      accept_invite_page.surf_to
      sign_in_page.ensure_flash_error_message_displayed('The invite could not be used because it has been revoked')
    end
  end
end
