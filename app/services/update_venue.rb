class UpdateVenue
  class Result < Struct.new(:success, :venue)
    def success?
      success
    end
  end

  def initialize(venue:, update_params:)
    @venue = venue
    @update_params = update_params
  end
  attr_reader :venue, :update_params

  def call
    success = venue.update_attributes(update_params)
    Result.new(success, venue)
  end
end
