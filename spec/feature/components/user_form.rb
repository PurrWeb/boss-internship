class UserForm < PageComponent
  page_action :fill_in_for do |user|
    scope.select(user.gender.titleize, from: 'Gender')
    scope.select(user.role.titleize, from: 'Role')
    scope.fill_in('First name', with: user.first_name)
    scope.fill_in('Sir name', with: user.sir_name)
    scope.fill_in('Email', with: user.email)
    scope.fill_in('Phone number', with: user.phone_number)
    scope.fill_in('Password', with: user.password)
    scope.select(user.date_of_birth.year, from: 'user_date_of_birth_1i')
    scope.select(user.date_of_birth.strftime("%B"), from: 'user_date_of_birth_2i')
    scope.select(user.date_of_birth.day, from: 'user_date_of_birth_3i')
    address_form.fill_in_for(user.address)
  end

  page_action :submit do
    click_button 'Submit'
  end

  def address_form
    @address_form ||= AddressForm.new(self)
  end

  def scope
    page.find('.user-form')
  end
end
