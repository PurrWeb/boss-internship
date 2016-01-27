module PageObject
  class StaffMemberPersonalDetailsForm < Component
    page_action :fill_in_name do |name|
      name_form.fill_in_for(name)
    end

    page_action :update_name do |name|
      name_form.fill_in_for(name)
      _submit_form
    end

    page_action :ui_shows_name do |name|
      name_form.ui_shows_name(name)
    end

    page_action :update_gender do |gender|
      _select_gender(gender)
      _submit_form
    end

    page_action :select_gender do |gender|
      _select_gender(gender)
    end

    page_action :ui_shows_gender do |gender|
      gender_select = scope.find(:select, 'Gender')
      expect(
        gender_select.value
      ).to eq(gender)
    end

    page_action :update_date_of_birth do |date|
      date_of_birth_field.fill_in_date(date)
      _submit_form
    end

    page_action :fill_in_date_of_birth do |date|
      date_of_birth_field.fill_in_date(date)
    end

    page_action :ui_shows_date_of_birth do |date|
      date_of_birth_field.ui_shows_date(date)
    end

    page_action :submit do
      _submit_form
    end

    def scope
      find('.personal-details-form')
    end

    private
    def date_of_birth_field
      @date_of_birth_field ||= DatePickerField.new(
        self,
        selector: '.staff-member-date-of-birth-field'
      )
    end

    def start_date_field
      @start_date_field ||= DatePickerField.new(
        self,
        selector: '.staff-member-starts-at-field'
      )
    end

    def name_form
      @name_form ||= NameForm.new(self)
    end

    def _select_gender(gender)
      scope.select(gender.titlecase, from: 'Gender')
    end

    def _submit_form
      scope.click_button('Update Staff member')
    end
  end
end
