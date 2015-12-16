require 'feature/feature_spec_helper'

RSpec.feature 'Accepting an invite' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:invite) { FactoryGirl.create(:invite, :admin, inviter: admin_user) }
  let(:prospective_user) { FactoryGirl.build(:user) }
  let(:accept_invite_page) { AcceptInvitePage.new(invite) }
  let(:home_page) { HomePage.new }

  scenario 'Anonymous user clicks on accept invite link in email and fills out form' do
    accept_invite_page.surf_to

    accept_invite_page.ensure_sign_up_text_displayed
    accept_invite_page.user_form.tap do |user_form|
      user_form.fill_in_for(prospective_user)
      user_form.submit
    end

    home_page.ensure_welcome_text_displayed_for(prospective_user)
    expect(User.joins(:email_address).merge(EmailAddress.where(email: invite.email)).first).to be_present
  end
end
