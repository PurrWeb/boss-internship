module PageObject
  class StaffMemberEmploymentDetailsForm < Component
    page_action :update_national_insurance_number do |national_insurance_number|
      scope.fill_in('National insurance number', with: national_insurance_number)
      scope.click_button('Update Staff member')
    end

    page_action :ui_shows_national_insurance_number do |national_insurance_number|
      expect(
        scope.find_field('National insurance number').value
      ).to eq(national_insurance_number)
    end

    def scope
      find('.employment-details-form')
    end
  end
end
