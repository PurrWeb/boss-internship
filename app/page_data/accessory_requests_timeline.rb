class AccessoryRequestsTimeline
  def initialize(accessory_requests:)
    @accessory_requests = accessory_requests
  end

  def serialize
    accessory_requests.inject({}) do |acc, accessory_request|
      acc.merge({"#{accessory_request.id}" => AccessoryRequestTimeline.new(accessory_request: accessory_request).serialize}) \
    end
  end

  attr_reader :accessory_requests
end