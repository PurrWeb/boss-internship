module PageObject
  class UserSignupForm < Component
    page_action :fill_in_for do |user|
      name_form.fill_in_for(user.name)
      _fill_in_password(user.password)
    end

    page_action :fill_in_password do |password|
      _fill_in_password(password)
    end

    page_action :submit do
      click_button 'Sign up'
    end

    def name_form
      @name_form ||= NameForm.new(self)
    end

    def scope
      super.find('.user-signup-form')
    end

    private
    def _fill_in_password(password)
      scope.fill_in('Password', with: password)
    end
  end
end
