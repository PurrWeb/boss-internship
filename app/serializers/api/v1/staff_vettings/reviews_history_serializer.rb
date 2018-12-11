class Api::V1::StaffVettings::ReviewsHistorySerializer < ActiveModel::Serializer
  attributes \
    :staffMemberId,
    :reviewedBy,
    :reviewedAt,
    :note

  def staffMemberId
    object.time_dodger_offence_level.staff_member_id
  end

  def reviewedBy
    object.creator_user.full_name
  end

  def reviewedAt
    object.created_at.iso8601
  end
end
