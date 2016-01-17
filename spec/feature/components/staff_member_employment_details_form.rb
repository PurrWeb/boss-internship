module PageObject
  class StaffMemberEmploymentDetailsForm < Component
    page_action :select_national_insurance_number do |national_insurance_number|
      _select_national_insurance_number(national_insurance_number)
    end

    page_action :update_national_insurance_number do |national_insurance_number|
      _select_national_insurance_number(national_insurance_number)
      _submit_form
    end

    page_action :ui_shows_national_insurance_number do |national_insurance_number|
      expect(
        scope.find_field('National insurance number').value
      ).to eq(national_insurance_number)
    end

    page_action :select_venue do |venue|
      _select_venue(venue)
    end

    page_action :update_venue do |venue|
      _select_venue(venue)
      _submit_form
    end

    page_action :ui_shows_venue do |venue|
      expect(
        scope.find_field('Venue').value
      ).to eq(venue.id.to_s)
    end

    page_action :select_staff_type do |staff_type|
      _select_staff_type(staff_type)
    end

    page_action :update_staff_type do |staff_type|
      _select_staff_type(staff_type)
      _submit_form
    end

    page_action :ui_shows_staff_type do |staff_type|
      expect(
        scope.find_field('Staff type').value
      ).to eq(staff_type.id.to_s)
    end

    page_action :submit do
      _submit_form
    end

    def scope
      find('.employment-details-form')
    end

    private
    def _select_venue(venue)
      scope.select(venue.name.titlecase, from: 'Venue')
    end

    def _select_national_insurance_number(national_insurance_number)
      scope.fill_in('National insurance number', with: national_insurance_number)
    end

    def _select_staff_type(staff_type)
      scope.select(staff_type.name.titlecase, from: 'Staff type')
    end

    def _submit_form
      scope.click_button('Update Staff member')
    end
  end
end
