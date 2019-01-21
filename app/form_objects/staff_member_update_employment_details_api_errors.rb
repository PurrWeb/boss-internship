class StaffMemberUpdateEmploymentDetailsApiErrors
  def initialize(staff_member: staff_member)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}

    result[:base] = staff_member.errors[:base] if staff_member.errors[:base].present?
    result[:employmentStatus] = staff_member.errors[:employment_status] if staff_member.errors[:employment_status].present?
    result[:masterVenue] = staff_member.errors[:master_venue] if staff_member.errors[:master_venue].present?
    result[:otherVenues] = staff_member.errors[:work_venues] if staff_member.errors[:work_venues].present?
    result[:staffType] = staff_member.errors[:staff_type] if staff_member.errors[:staff_type].present?
    result[:payRate] = staff_member.errors[:pay_rate] if staff_member.errors[:pay_rate].present?
    result[:nationalInsuranceNumber] = staff_member.errors[:national_insurance_number] if staff_member.errors[:national_insurance_number].present?
    result[:sageId] = staff_member.errors[:sage_id] if staff_member.errors[:sage_id].present?
    result[:hoursPreferenceNote] = staff_member.errors[:hours_preference_note] if staff_member.errors[:hours_preference_note].present?
    result[:dayPreferenceNote] = staff_member.errors[:day_preference_note] if staff_member.errors[:day_preference_note].present?
    result[:startsAt] = staff_member.errors[:starts_at] if staff_member.errors[:starts_at].present?
    result[:siaBadgeNumber] = staff_member.errors[:sia_badge_number] if staff_member.errors[:sia_badge_number].present?
    result[:siaBadgeExpiryDate] = staff_member.errors[:sia_badge_expiry_date] if staff_member.errors[:sia_badge_expiry_date].present?

    result
  end
end
