class NameForm < PageComponent
  page_action :fill_in_for do |name|
    scope.fill_in('First name', with: name.first_name)
    scope.fill_in('Surname', with: name.surname)
  end

  def scope
    parent.scope.find('.name-form')
  end
end
