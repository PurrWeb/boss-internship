require 'feature/feature_spec_helper'

RSpec.feature 'Inviting a new user' do
  let(:admin_email) { FactoryGirl.create(:email_address, email: 'admin.email@foo.com') }
  let(:new_email) { FactoryGirl.build(:email_address, email: 'new.email@foo.com') }
  let(:admin_user) { FactoryGirl.create(:user, :admin, email_address: admin_email) }
  let(:prospective_user) { FactoryGirl.build(:user, email_address: new_email) }
  let(:invite_new_user_page) { InviteNewUserPage.new }
  let(:invites_index_page) { InvitesIndexPage.new }

  before do
    login_as admin_user
  end

  scenario 'Adding a valid invite to the system should be succeed and should send an invite email' do
    invite_new_user_page.surf_to

    invite_new_user_page.form.tap do |form|
      form.fill_in_for(prospective_user)
      form.submit
    end

    invites_index_page.ensure_flash_success_message_displayed('Invite created successfully')
    invite = Invite.find_by!(email: prospective_user.email)
    invites_index_page.invites_table.ensure_details_displayed_for(invite)

    invite_email = ActionMailer::Base.deliveries.last
    expect(invite_email).to be_present
    expect(invite_email.subject).to eq('Your invite to JSM Bars Boss System')
    expect(invite_email.to).to eq([prospective_user.email])
  end

  context 'Email address is already taken' do
    let(:new_email) { admin_email }

    scenario 'Attempting to create the invite should display an error message and not send an email' do
      invite_new_user_page.surf_to

      invite_new_user_page.form.tap do |form|
        form.fill_in_for(prospective_user)
        form.submit
      end

      invite_new_user_page.ensure_flash_error_message_displayed('There was a problem creating this invite')
      expect(ActionMailer::Base.deliveries).to be_empty
    end
  end
end
