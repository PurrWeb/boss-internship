module PageObject
  class UserPersonalDetailsForm < Component
    page_action :update_name do |name|
      name_form.fill_in_for(name)
      submit_form
    end

    page_action :ui_shows_name do |name|
      name_form.ui_shows_name(name)
    end

    page_action :update_email do |email|
      scope.fill_in('Email', with: email)
      submit_form
    end

    page_action :ui_shows_email do |email|
      expect(scope.find_field('Email').value).to eq(email)
    end

    def scope
      find('.user-form')
    end

    private
    def name_form
      @name_form ||= NameForm.new(self)
    end

    def submit_form
      scope.click_button('Update')
    end
  end
end
