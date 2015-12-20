class InviteForm < PageObject::Component
  page_action :fill_in_for do |user|
    scope.select(user.role.titleize, from: 'Role')
    scope.fill_in('Email', with: user.email)
  end

  page_action :submit do
    click_button 'Submit'
  end

  def scope
    page.find('.invite-form')
  end
end
