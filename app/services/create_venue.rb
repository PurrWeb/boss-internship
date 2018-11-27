class CreateVenue
  class Result < Struct.new(:success, :venue)
    def success?
      success
    end
  end

  def initialize(requester:, params:)
    @requester = requester
    @params = params
  end
  attr_reader :requester, :params

  def call
    success = false
    venue = nil
    default_questionnaire = Questionnaire.first
    raise 'Default questionnaire must exist' unless default_questionnaire.present?

    ActiveRecord::Base.transaction do
      venue = Venue.create(
        creator: requester,
        name: params[:name],
        fruit_order_fields: params[:fruit_order_fields],
        till_float_cents: params[:till_float_cents],
        safe_float_cents: params[:safe_float_cents],
        change_order_site_id: params[:change_order_site_id],
        latitude: params[:latitude],
        longitude: params[:longitude],
        questionnaires: [default_questionnaire]
      )
      success = venue.persisted?
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, venue)
  end
end
