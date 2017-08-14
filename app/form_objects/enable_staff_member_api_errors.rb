class EnableStaffMemberApiErrors
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}

    result[:base] = staff_member.errors[:base] if staff_member.errors[:base].present?
    result[:starts_at] = staff_member.errors[:starts_at] if staff_member.errors[:starts_at].present?
    result[:main_venue_id] = staff_member.errors[:master_venue] if staff_member.errors[:master_venue].present?
    result[:other_venue_ids] = staff_member.errors[:work_venues] if staff_member.errors[:work_venues].present?
    result[:staff_type_id] = staff_member.errors[:staff_type] if staff_member.errors[:staff_type].present?
    result[:pin_code] = staff_member.errors[:pin_code] if staff_member.errors[:pin_code].present?
    result[:gender] = staff_member.errors[:gender] if staff_member.errors[:gender].present?
    result[:phone_number] = staff_member.errors[:phone_number] if staff_member.errors[:phone_number].present?
    result[:date_of_birth] = staff_member.errors[:date_of_birth] if staff_member.errors[:date_of_birth].present?
    result[:national_insurance_number] = staff_member.errors[:national_insurance_number] if staff_member.errors[:national_insurance_number].present?
    result[:avatar_base64] = staff_member.errors[:avatar] if staff_member.errors[:avatar].present?
    result[:pay_rate_id] = staff_member.errors[:pay_rate] if staff_member.errors[:pay_rate].present?
    result[:first_name] = staff_member.name.errors[:first_name] if staff_member.name.errors[:first_name].present?
    result[:surname] = staff_member.name.errors[:surname] if staff_member.name.errors[:surname].present?

    address = staff_member.address
    result[:address] = address.errors[:address] if address.errors[:address].present?
    result[:postcode] = address.errors[:postcode] if address.errors[:postcode].present?
    result[:country] = address.errors[:country] if address.errors[:country].present?
    result[:county] = address.errors[:county] if address.errors[:county].present?

    email_address = staff_member.email_address
    result[:email_addres] = email_address.errors[:email] if email_address.errors[:email].present?
    result[:sia_badge_number] = staff_member.errors[:sia_badge_number] if staff_member.errors[:sia_badge_number].present?
    result[:sia_badge_expiry_date] = staff_member.errors[:sia_badge_expiry_date] if staff_member.errors[:sia_badge_expiry_date].present?


    result
  end
end
