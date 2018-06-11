class StaffMemberUpdateEmploymentDetailsApiErrors
  def initialize(staff_member: staff_member)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}

    result[:base] = staff_member.errors[:base] if staff_member.errors[:base].present?
    result[:master_venue] = staff_member.errors[:master_venue] if staff_member.errors[:master_venue].present?
    result[:other_venues] = staff_member.errors[:work_venues] if staff_member.errors[:work_venues].present?
    result[:staff_type] = staff_member.errors[:staff_type] if staff_member.errors[:staff_type].present?
    result[:pay_rate] = staff_member.errors[:pay_rate] if staff_member.errors[:pay_rate].present?
    result[:national_insurance_number] = staff_member.errors[:national_insurance_number] if staff_member.errors[:national_insurance_number].present?
    result[:sage_id] = staff_member.errors[:sage_id] if staff_member.errors[:sage_id].present?
    result[:hours_preference_note] = staff_member.errors[:hours_preference_note] if staff_member.errors[:hours_preference_note].present?
    result[:day_preference_note] = staff_member.errors[:day_preference_note] if staff_member.errors[:day_preference_note].present?
    result[:starts_at] = staff_member.errors[:starts_at] if staff_member.errors[:starts_at].present?
    result[:sia_badge_number] = staff_member.errors[:sia_badge_number] if staff_member.errors[:sia_badge_number].present?
    result[:sia_badge_expiry_date] = staff_member.errors[:sia_badge_expiry_date] if staff_member.errors[:sia_badge_expiry_date].present?

    result
  end
end
