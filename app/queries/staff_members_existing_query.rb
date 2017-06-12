class StaffMembersExistingQuery
  def initialize(email = nil, nin = nil)
    @email = email
    @nin = nin
  end
  
  def staff_members
    staff_members_table = StaffMember.arel_table
    emails_table = EmailAddress.arel_table

    where_clause = emails_table[:email].eq(email).or(staff_members_table[:national_insurance_number].eq(nin.upcase)) if email.present? && nin.present?
    where_clause = emails_table[:email].eq(email) if email.present? && !nin.present?
    where_clause = staff_members_table[:national_insurance_number].eq(nin.upcase) if nin.present? & !email.present?

    StaffMember.
      not_flagged.
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
        existing_staff_member[:field] = "national insurance number" if staff_member.national_insurance_number === nin
        existing_staff_member[:field] = "email and national insurance number" if staff_member.national_insurance_number === nin && staff_member.email_address.email === email
        existing_staff_member
      end
    else
      []
    end
  end

  private
  attr_reader :email, :nin

end
