class SecurityVenue < ActiveRecord::Base
  VENUE_TYPE = "security".freeze

  belongs_to :creator_user, class_name: "User"

  def venue_type
    VENUE_TYPE
  end
end
