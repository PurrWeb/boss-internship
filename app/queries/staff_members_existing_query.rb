class StaffMembersExistingQuery
  def initialize(email: nil, national_insurance_number: nil)
    @email = email
    @national_insurance_number = national_insurance_number
  end

  def staff_members
    staff_members_table = StaffMember.arel_table
    emails_table = EmailAddress.arel_table

    where_clause = emails_table[:email].eq(email).or(staff_members_table[:national_insurance_number].eq(national_insurance_number.upcase)) if email.present? && national_insurance_number.present?
    where_clause = emails_table[:email].eq(email) if email.present? && !national_insurance_number.present?
    where_clause = staff_members_table[:national_insurance_number].eq(national_insurance_number.upcase) if national_insurance_number.present? & !email.present?

    disabled_not_flagged_ids = StaffMember.disabled.not_flagged.pluck(:id)
    enabled_ids = StaffMember.enabled.pluck(:id)

    StaffMember.
      where(id: Array(disabled_not_flagged_ids) + Array(enabled_ids)).
      joins(:email_address).
      where(where_clause).
      all
  end

  def profiles
    if staff_members.present?
      staff_members.map do |staff_member|
        existing_staff_member = {}
        existing_staff_member[:profile_url] = Rails.application.routes.url_helpers.staff_member_path(staff_member)
        existing_staff_member[:full_name] = staff_member.full_name
        existing_staff_member[:field] = "email" if staff_member.email_address.email === email
        existing_staff_member[:field] = "national insurance number" if staff_member.national_insurance_number === national_insurance_number
        existing_staff_member[:field] = "email and national insurance number" if staff_member.national_insurance_number === national_insurance_number && staff_member.email_address.email === email
        existing_staff_member
      end
    else
      []
    end
  end

  private
  attr_reader :email, :national_insurance_number

end
