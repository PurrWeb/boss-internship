class UserForm < PageComponent
  page_action :fill_in_for do |user|
    scope.select(user.role.titleize, from: 'Role')
    scope.fill_in('First name', with: user.first_name)
    scope.fill_in('Surname', with: user.surname)
    scope.fill_in('Email', with: user.email)
    scope.fill_in('Password', with: user.password)
  end

  page_action :submit do
    click_button 'Submit'
  end

  def scope
    page.find('.user-form')
  end
end
