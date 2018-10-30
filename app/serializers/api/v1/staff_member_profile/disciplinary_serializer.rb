class Api::V1::StaffMemberProfile::DisciplinarySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :title,
    :level,
    :conduct,
    :consequence,
    :nature,
    :createdAt,
    :expiredAt,
    :createdByUser,
    :disabledByUser,
    :disabledAt,
    :levelText,
    :levelExpiration

  def levelText
    object.warning_level_text
  end

  def levelExpiration
    object.expiration_description
  end

  def createdAt
    object.created_at.iso8601
  end

  def expiredAt
    object.expired_at.iso8601
  end

  def createdByUser
    object.created_by_user.full_name
  end

  def disabledByUser
    object.disabled_by_user.full_name if object.disabled_by_user.present?
  end

  def disabledAt
    object.disabled_at.iso8601 if object.disabled_at.present?
  end
end
