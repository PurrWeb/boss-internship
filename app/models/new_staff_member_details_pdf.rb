class NewStaffMemberDetailsPDF
  include ActionView::Helpers::NumberHelper

  def initialize(staff_member)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def render
    Prawn::Document.new do |pdf|
      pdf.table(data)
    end.render
  end

  def data
    result = []
    result << ['Name', staff_member.full_name.titlecase]

    if staff_member.date_of_birth.present?
      result << ['Date of Birth', staff_member.date_of_birth.to_s(:human_date)]
    else
      result << ['Date of Birth', 'Not Supplied']
    end

    result << ['Gender', staff_member.gender.titlecase]

    if staff_member.national_insurance_number.present?
      result << ['National Insurance Number', staff_member.national_insurance_number]
    else
      result << ['National Insurance Number', 'Not Supplied']
    end

    if staff_member.email.present?
      result << ['Email', staff_member.email]
    else
      result << ['Email', 'Not Supplied']
    end

    result << ['Staff Type', staff_member.staff_type.name]
    result << ['Pay Rate', staff_member.pay_rate.text_description]

    if staff_member.security?
      result << ['SIA Badge Number', staff_member.sia_badge_number]
      result << ['SIA Badge Expiry Date', staff_member.sia_badge_expiry_date.to_s(:human_date)]
    end

    result << ['Address 1', staff_member.address.andand.address_1 || 'Not Supplied']
    result << ['Address 2', staff_member.address.andand.address_2 || 'Not Supplied']
    result << ['Address 3', staff_member.address.andand.address_3 || 'Not Supplied']
    result << ['Address 4', staff_member.address.andand.address_4 || 'Not Supplied']
    result << ['Region',    staff_member.address.andand.region || 'Not Supplied']
    result << ['Country',   staff_member.address.andand.country || 'Not Supplied']
    result << ['Postcode',  staff_member.address.andand.postcode || 'Not Supplied']

    result << ['Start Date', staff_member.starts_at.to_s(:human_date)]

    employment_status_message = []
    employment_status_message << 'I have supplied my P45 from my previous employer' if staff_member.employment_status_statement_completed
    employment_status_message << 'A (This is my first job since the 6th of April. I have not been receiving taxable Jobseeker\'s Allowance, Incapacity Benefit or a state/occupational pension.)' if staff_member.employment_status_a
    employment_status_message << 'B (This is now my only job. Since the 6th of April I have had another job, received taxable Jobseeker\'s Allowance or Incapacity Benefit. I do not receive a state/occupational pension.)' if staff_member.employment_status_b
    employment_status_message << 'C (I have another job or receive a state/occupational pernsion.)' if staff_member.employment_status_c
    employment_status_message << 'D (I left a course of higher education before the 6th of April & received my first student loan instalment on or after the 1st of September 1998 & I have not fully repaid my student loan.)' if staff_member.employment_status_d

    result << ['Employment Status Statement', employment_status_message.to_sentence]

    result
  end
end
