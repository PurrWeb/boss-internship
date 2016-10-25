class StaffMemberUpdateDetailsPDF
  include ActionView::Helpers::NumberHelper

  def initialize(staff_member_name:, changed_attributes:, new_values:, old_values:)
    @staff_member_name = staff_member_name
    @changed_attributes = changed_attributes
    @old_values = old_values
    @new_values = new_values
  end
  attr_reader :staff_member_name, :changed_attributes, :new_values, :old_values

  def render
    Prawn::Document.new do |pdf|
      pdf.text "#{staff_member_name} - Updates"
      pdf.table(data)
    end.render
  end

  def data
    result = []
    result << ['', 'Previous', 'Current']
    changed_attributes.each do |key, value|
      result << [heading_for_key(key), old_values.fetch(key).to_s, new_values.fetch(key).to_s]
    end
    result
  end

  def heading_for_key(key)
    {
      name: 'Name',
      gender: 'Gender',
      email_address: 'Email',
      pay_rate_id: 'Pay Rate',
      address:   'Address',
      county:    'County',
      country:   'Country',
      postcode:  'Postcode',
      phone_number: 'Phone number',
      staff_type_id: 'Staff Type',
      starts_at: 'Start Date',
      date_of_birth: 'Date of Birth',
      sia_badge_number: 'SIA Badge Number',
      sia_badge_expiry_date: 'SIA Badge Expiry Date',
      national_insurance_number: 'National Insurance Number',
      employment_status_statement: 'Employment Status Statement',
      master_venue: 'Venue'
    }.fetch(key)
  end
end
