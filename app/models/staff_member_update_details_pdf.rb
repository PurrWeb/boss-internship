class StaffMemberUpdateDetailsPDF
  include ActionView::Helpers::NumberHelper

  def initialize(staff_member_name:, changed_attributes:)
    @staff_member_name = staff_member_name
    @changed_attributes = changed_attributes
  end
  attr_reader :staff_member_name, :changed_attributes

  def render
    Prawn::Document.new do |pdf|
      pdf.text "#{staff_member_name} - Updated Values"
      pdf.table(data)
    end.render
  end

  def data
    result = []
    changed_attributes.each do |key, value|
      result << [heading_for_key(key), value]
    end
    result
  end

  def heading_for_key(key)
    {
      name: 'Name',
      gender: 'Gender',
      email: 'Email',
      pay_rate: 'Pay Rate',
      address_1: 'Address 1',
      address_2: 'Address 2',
      address_3: 'Address 3',
      address_4: 'Address 4',
      region:    'Region',
      country:   'Country',
      postcode:  'Postcode',
      staff_type: 'Staff Type',
      start_date: 'Start Date',
      date_of_birth: 'Date of Birth',
      sia_badge_number: 'SIA Badge Number',
      sia_badge_expiry_date: 'SIA Badge Expiry Date',
      national_insurance_number: 'National Insurance Number',
      employment_status_statement: 'Employment Status Statement'
    }.fetch(key)
  end
end
