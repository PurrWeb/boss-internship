class Api::SecurityApp::V1::ProfileStaffMemberSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :firstName,
    :surname,
    :email,
    :avatarImageUrl,
    :phoneNumber,
    :niNumber,
    :siaBadgeExpiryDate,
    :siaBadgeNumber,
    :address,
    :county,
    :country,
    :postcode,
    :dateOfBirth

  def firstName
    object.name.first_name
  end

  def surname
    object.name.surname
  end

  def email
    object.email
  end

  def dateOfBirth
    object.date_of_birth && UIRotaDate.format(object.date_of_birth)
  end

  def avatarImageUrl
    object.avatar_url
  end

  def phoneNumber
    object.phone_number
  end

  def niNumber
    object.national_insurance_number
  end

  def siaBadgeExpiryDate
    UIRotaDate.format(object.sia_badge_expiry_date)
  end

  def siaBadgeNumber
    object.sia_badge_number
  end

  def address
    object.address.andand.address
  end

  def county
    object.address.andand.county
  end

  def country
    object.address.andand.country
  end

  def postcode
    object.address.andand.postcode
  end
end
