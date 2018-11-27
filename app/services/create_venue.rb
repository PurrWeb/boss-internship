class CreateVenue
  class Result < Struct.new(:success, :venue)
    def success?
      success
    end
  end

  def initialize(requester:, params:, reminder_users:)
    @requester = requester
    @params = params
    @reminder_users = reminder_users
  end
  attr_reader :requester, :params, :reminder_users

  def call
    success = false
    venue = nil

    ActiveRecord::Base.transaction do
      venue = Venue.create(
        creator: requester,
        reminder_users: reminder_users,
        name: params[:name],
        fruit_order_fields: params[:fruit_order_fields],
        till_float_cents: params[:till_float_cents],
        safe_float_cents: params[:safe_float_cents],
        change_order_site_id: params[:change_order_site_id],
        latitude: params[:latitude],
        longitude: params[:longitude]
      )
      success = venue.persisted?
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, venue)
  end
end
