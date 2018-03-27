class Api::V1::HoursConfirmation::VenueSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes \
    :id,
    :name
end
