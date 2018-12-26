class Api::IdScannerApp::V1::IdScannerScanAttemptSerialiser < ActiveModel::Serializer
  attributes \
    :apiKeyName,
    :at,
    :status,
    :guid,
    :staffMemberName,
    :staffMemberMasterVenueName,
    :staffMemberAvatarUrl

  def apiKeyName
    object.api_key.name
  end

  def at
    object.created_at.iso8601
  end

  def status
    object.status
  end

  def guid
    object.guid
  end

  def staffMemberName
    object.linked_staff_member.andand.full_name
  end

  def staffMemberMasterVenueName
    object.linked_staff_member.andand.master_venue.andand.name
  end

  def staffMemberAvatarUrl
    object.linked_staff_member.andand.avatar_url
  end
end
