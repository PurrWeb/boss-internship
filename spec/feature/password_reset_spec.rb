require 'feature/feature_spec_helper'

RSpec.feature 'Password Reset' do
  let(:password) { 'FORGOTTEN_PASSWORD' }
  let(:user) { FactoryGirl.create(:user, :admin, password: password) }

  let(:sign_in_page) { PageObject::SignInPage.new }
  let(:forgotten_password_page) { PageObject::ForgottenPasswordPage.new }
  let(:home_page) { PageObject::HomePage.new }
  let(:venue_dashboard_page) { PageObject::VenueDashboardPage.new }

  scenario "There should be a 'forgot your password?' link on the sign in page" do
    sign_in_page.surf_to
    sign_in_page.click_forgotten_password_link

    forgotten_password_page.assert_on_correct_page
  end

  scenario "User requesting some reset instructions should get an email with reset instructions" do
    expect(user.reset_password_token).to be_nil
    expect(ActionMailer::Base.deliveries.count).to eq(0)

    forgotten_password_page.surf_to
    forgotten_password_page.request_reset_instructions_for(user)

    sign_in_page.ensure_flash_notice_message_displayed('You will receive an email with instructions on how to reset your password in a few minutes.')
    expect(user.reload.reset_password_token).to_not be_nil

    expect(ActionMailer::Base.deliveries.count).to eq(1)
    ActionMailer::Base.deliveries.first.tap do |mail|
      expect(mail.subject).to eq('Reset password instructions')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@jsmbars.co.uk'])

      reset_url = Rails.application.routes.url_helpers.edit_user_password_url
      reset_link_regex_with_token_capture = /<a .*href="#{Regexp.escape(reset_url + "?reset_password_token=")}(\S+)".*>.*<\/a>/

      link_match = mail.body.decoded.match(reset_link_regex_with_token_capture)

      expect(link_match).to be_present

      token = link_match.captures.first
      expect(User.with_reset_password_token(token).id).to eq(user.id)
    end
  end

  context 'user has a password reset' do
    let(:token) { user.send_reset_password_instructions }
    let(:reset_password_page) { PageObject::ResetPasswordPage.new(token) }
    let(:user) { FactoryGirl.create(:user, password: 'old_password', venues: [FactoryGirl.create(:venue)]) }
    let(:new_password) { 'new_password' }

    before do
      token
    end

    scenario 'user uses password reset token' do
      reset_password_page.surf_to
      reset_password_page.change_password_to(new_password)
      venue_dashboard_page.ensure_flash_notice_message_displayed('Your password has been changed successfully. You are now signed in.')
      expect(user.reload.valid_password?(new_password)).to eq(true)
    end

    context 'with used password token' do
      let(:token) do
        user.send_reset_password_instructions.tap do |token|
          user.update_attributes!(reset_password_sent_at: nil)
        end
      end

      scenario 'user attempts to reuse a token that has alerdy been used' do
        reset_password_page.surf_to
        sign_in_page.ensure_flash_error_message_displayed('The token could not be used because it expired.')
      end
    end
  end
end
