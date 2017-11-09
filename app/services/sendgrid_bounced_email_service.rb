require 'sendgrid-ruby'

class SendgridBouncedEmailService
  include SendGrid

  def self.call
    send_grid = SendGrid::API.new(api_key: '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')
    bounce_data = JSON.parse(send_grid.client.suppression.bounces.get.body, symbolize_names: true)

    normalised_bounce_data = bounce_data.map do |bounce_data|
      created_unix_date = bounce_data.fetch(:created)
      error_code = bounce_data.fetch(:status)
      bounce_data.except(:created, :status).merge(
        bounced_at: Time.at(created_unix_date).iso8601,
        error_code: error_code
      )
    end
  end
end
