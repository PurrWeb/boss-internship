class TestMailer < ApplicationMailer
  def test_mail(email)
    mail(to: email, subject: 'Test')
  end
end
