class UpdateVenue
  class Result < Struct.new(:success, :venue)
    def success?
      success
    end
  end

  def initialize(venue:, params:, reminder_users:)
    @venue = venue
    @params = params
    @reminder_users = reminder_users
  end
  attr_reader :venue, :params, :reminder_users

  def call
    success = false
    ActiveRecord::Base.transaction do
      success = venue.update_attributes(params)
      if success
        venue.reminder_users = reminder_users
        success = venue.save
      end
      raise ActiveRecord::Rollback unless success
    end
    Result.new(success, venue)
  end
end
