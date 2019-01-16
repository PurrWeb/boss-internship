class Api::V1::StaffMemberProfile::StaffMemberSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id,
             :avatarUrl,
             :firstName,
             :surname,
             :age,
             :email,
             :phoneNumber,
             :masterVenueId,
             :otherVenueIds,
             :staffTypeId,
             :payRateId,
             :hoursPreferenceNote,
             :dayPreferenceNote,
             :nationalInsuranceNumber,
             :isDisabled,
             :disabledAt,
             :disableReason,
             :disabledByUser,
             :gender,
             :dateOfBirth,
             :startsAt,
             :address,
             :country,
             :postcode,
             :county,
             :statusStatement,
             :updatedAt,
             :siaBadgeNumber,
             :siaBadgeExpiryDate,
             :isSecurityStaff,
             :createdAt,
             :hasUser,
             :bouncedEmail,
             :verificationSentAt,
             :verifiedAt,
             :passwordSetAt,
             :isFlagged,
             :isWeeklyPayrate,
             :sageId

  def avatarUrl
    object.avatar_url
  end

  def firstName
    object.name.first_name
  end

  def surname
    object.name.surname
  end

  def phoneNumber
    object.phone_number
  end

  def masterVenueId
    object.master_venue.andand.id
  end

  def otherVenueIds
    object.work_venues.map(&:id)
  end

  def staffTypeId
    object.staff_type.andand.id
  end

  def payRateId
    object.pay_rate.andand.id
  end

  def hoursPreferenceNote
    object.hours_preference_note
  end

  def dayPreferenceNote
    object.day_perference_note
  end

  def nationalInsuranceNumber
    object.national_insurance_number
  end

  def isDisabled
    object.disabled?
  end

  def disabledAt
    object.disabled_at.andand.iso8601
  end

  def disableReason
    object.disable_reason
  end

  def disabledByUser
    object.disabled_by_user.andand.full_name.andand.titlecase
  end

  def dateOfBirth
    UIRotaDate.safe_format(object.date_of_birth)
  end

  def startsAt
    UIRotaDate.format(object.starts_at)
  end

  def address
    object.address.andand.address
  end

  def postcode
    object.address.andand.postcode
  end

  def country
    object.address.andand.country
  end

  def county
    object.address.andand.county
  end

  def statusStatement
    [:employment_status_a,
     :employment_status_b,
     :employment_status_c,
     :employment_status_d,
     :employment_status_p45_supplied].find do |statement|
      object.send(statement) == true
    end
  end

  def updatedAt
    object.updated_at.iso8601
  end

  def siaBadgeNumber
    object.sia_badge_number
  end

  def siaBadgeExpiryDate
    UIRotaDate.safe_format(object.sia_badge_expiry_date)
  end

  def isSecurityStaff
    object.security?
  end

  def createdAt
    object.created_at.iso8601
  end

  def hasUser
    object.has_user?
  end

  def bouncedEmail
    object.email_address.andand.bounced_data
  end

  def verificationSentAt
    object.verification_sent_at.andand.iso8601
  end

  def verifiedAt
    object.verified_at.andand.iso8601
  end

  def passwordSetAt
    object.password_set_at.andand.iso8601
  end

  def isFlagged
    object.flagged?
  end

  def isWeeklyPayrate
    object.pay_rate.weekly?
  end

  def sageId
    object.sage_id
  end
end
