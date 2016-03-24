require 'rails_helper'

RSpec.describe InviteMailer do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:invite) { FactoryGirl.create(:invite, :admin, inviter: admin_user) }

  describe 'invite_mail' do
    let(:mail) { InviteMailer.invite_mail(invite) }

    it 'should have the correct subject' do
      expect(mail.subject).to eq('Your invite to JSM Bars Boss System')
    end

    it 'should be sent to the invite recipient' do
      expect(mail.to).to eq([invite.email])
    end

    it 'should be sent from our no-reply email address' do
      expect(mail.from).to eq(['no-reply@jsmbars.co.uk'])
    end

    it 'should say who invited you' do
      expect(mail.html_part.body.decoded).to include("#{admin_user.full_name.titlecase} invited you to the boss system.")
      expect(mail.text_part.body.decoded).to include("#{admin_user.full_name.titlecase} invited you to the boss system.")
    end

    it 'should contain a link to accept the invite containing its token' do
      token_url = Rails.application.routes.url_helpers.accept_invite_url(invite.token)
      expect(mail.html_part.body.decoded).to match(/<a .*href="#{Regexp.escape(token_url)}".*>.*<\/a>/)
      expect(mail.text_part.body.decoded).to include("Please go to #{token_url} to complete the sign up process.")
    end
  end
end
