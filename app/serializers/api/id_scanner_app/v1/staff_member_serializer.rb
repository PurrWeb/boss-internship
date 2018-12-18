class Api::IdScannerApp::V1::StaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :name,
    :masterVenueName,
    :avatarUrl

  def name
    object.full_name
  end

  def masterVenueName
    object.master_venue.present? ? object.master_venue.name : 'N/A'
  end

  def avatarUrl
    object.avatar_url
  end
end
