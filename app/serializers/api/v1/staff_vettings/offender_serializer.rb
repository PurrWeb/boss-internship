class Api::V1::StaffVettings::OffenderSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :offenceLevel,
    :reviewLevel,
    :markNeeded

  def staffMemberId
    object.staff_member_id
  end

  def offenceLevel
    object.offence_level
  end

  def reviewLevel
    object.review_level
  end

  def markNeeded
    object.offence_level > object.review_level
  end
end
