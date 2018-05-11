class SecurityVenue < ActiveRecord::Base
  belongs_to :creator_user, class_name: "User"
end
