
class UpdateBouncedEmailsJob < ActiveJob::Base

  def perform
    bounced_email_service = if Rails.env.production?
      SendgridBouncedEmailService
    else
      FakeBouncedEmailService
    end
    normalised_bounce_data = bounced_email_service.call
    if BouncedEmailAddress.bounce_data_valid?(bounce_data: normalised_bounce_data)
      BouncedEmailAddress.clear
      BouncedEmailAddress.update(bounce_data: normalised_bounce_data)
    end
  end
end

