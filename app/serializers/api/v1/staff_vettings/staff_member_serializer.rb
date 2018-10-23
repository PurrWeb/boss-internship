class Api::V1::StaffVettings::StaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :firstName,
    :surname,
    :avatarUrl,
    :venueId,
    :staffTypeId,
    :payRateId,
    :siaBadgeExpiryDate,
    :dateOfBirth,
    :bouncedEmailData,
    :isSecurityStaff,
    :sageId

  def isSecurityStaff
    object.security?
  end

  def sageId
    object.sage_id
  end

  def bouncedEmailData
    object.email_address.bounced_data
  end

  def firstName
    object.andand.name.andand.first_name
  end

  def surname
    object.andand.name.andand.surname
  end

  def avatarUrl
    object.avatar_url
  end

  def venueId
    object.master_venue_id
  end

  def staffTypeId
    object.staff_type_id
  end

  def payRateId
    object.pay_rate_id
  end

  def siaBadgeExpiryDate
    object.sia_badge_expiry_date
  end

  def dateOfBirth
    object.date_of_birth
  end
end
