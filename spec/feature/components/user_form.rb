class UserForm < PageComponent
  page_action :fill_in_for do |user|
    scope.select(user.role.titleize, from: 'Role')
    name_form.fill_in_for(user.name)
    scope.fill_in('Email', with: user.email)
    scope.fill_in('Password', with: user.password)
  end

  page_action :submit do
    click_button 'Submit'
  end

  def name_form
    @name_form ||= NameForm.new(self)
  end

  def scope
    page.find('.user-form')
  end
end
