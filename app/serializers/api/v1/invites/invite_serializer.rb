class Api::V1::Invites::InviteSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :role,
    :email,
    :inviterFullName,
    :createdAt,
    :currentState,
    :venueIds,
    :bouncedEmailData

  def createdAt
    object.created_at.iso8601
  end
  
  def inviterFullName
    object.inviter.full_name.titlecase
  end

  def currentState
    object.current_state
  end
  
  def venueIds
    object.venue_ids
  end

  def bouncedEmailData
    object.email_bounced_data
  end
end
