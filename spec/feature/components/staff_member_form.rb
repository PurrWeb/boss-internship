class StaffMemberForm < PageComponent
  page_action :fill_in_for do |staff_member|
    scope.select(staff_member.gender.titleize, from: 'Gender')
    name_form.fill_in_for(staff_member.name)
    scope.fill_in('Email', with: staff_member.email)
    scope.fill_in('National insurance number', with: staff_member.national_insurance_number)
    scope.fill_in('Phone number', with: staff_member.phone_number)
    scope.select(staff_member.date_of_birth.year, from: 'staff_member_date_of_birth_1i')
    scope.select(staff_member.date_of_birth.strftime("%B"), from: 'staff_member_date_of_birth_2i')
    scope.select(staff_member.date_of_birth.day, from: 'staff_member_date_of_birth_3i')
    address_form.fill_in_for(staff_member.address)
  end

  page_action :submit do
    click_button 'Submit'
  end

  def name_form
    @name_form ||= NameForm.new(self)
  end

  def address_form
    @address_form ||= AddressForm.new(self)
  end

  def scope
    page.find('.staff-member-form')
  end
end
