class UpdateBouncedEmailsJob < ActiveJob::Base
  def perform(env: Rails.env, service: SendgridBouncedEmailService)
    return unless env == "production"
    normalised_bounce_data = service.call

    unless BouncedEmailAddress.bounce_data_valid?(bounce_data: normalised_bounce_data)
      raise "API returned Invalid bounced data supplied #{normalised_bounce_data}";
    end
    BouncedEmailAddress.clear
    BouncedEmailAddress.update(bounce_data: normalised_bounce_data)
  end
end

