class ClockingAppAblyService
  def initialize(venue_api_key:)
    @venue_api_key = venue_api_key.upcase
  end

  attr_reader :venue_api_key

  def request_token
    client.auth.request_token({
      ttl: 60,
      capability: {venue_api_key => ["subscribe"]},
    })
  end

  def clocking_app_data_update(updates:, deletes:)
    channel = client.channel(venue_api_key)
    channel.publish("data", {data: {updates: updates, deletes: deletes}})
  end

  private

  def client
    @client ||= Ably::Rest.new(key: ENV.fetch("ABLY_API_KEY"))
  end
end
