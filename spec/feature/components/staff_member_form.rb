module PageObject
  class StaffMemberForm < Component
    page_action :fill_in_for do |staff_member|
      scope.attach_file("staff_member[avatar]", TestImageHelper.arnie_face_path)
      if staff_member.venue.present?
        scope.select(staff_member.venue.name, from: 'Venue')
      end
      scope.select(staff_member.gender.titleize, from: 'Gender')
      name_form.fill_in_for(staff_member.name)
      scope.fill_in('Email', with: staff_member.email)
      scope.fill_in('National insurance number', with: staff_member.national_insurance_number)
      scope.select(staff_member.staff_type.name.titleize, from: 'Staff type')
      scope.fill_in('Pin code', with: staff_member.pin_code)
      scope.fill_in('Phone number', with: staff_member.phone_number)
      date_of_birth_field.fill_in_date(staff_member.date_of_birth)
      address_form.fill_in_for(staff_member.address)
      scope.fill_in('Day Preference', with: staff_member.day_perference_note)
      scope.fill_in('Hours Preference', with: staff_member.hours_preference_note)
      starts_at_field.fill_in_date(staff_member.starts_at)
    end

    page_action :upload_avatar_image do
      scope.attach_file("staff_member[avatar]", TestImageHelper.arnie_face_path)
    end

    page_action :ensure_photo_displayed do
      scope.find('.avatar_preview')
    end

    page_action :submit do
      click_button 'Submit'
    end

    def starts_at_field
      @starts_at_field ||= DatePickerField.new(self, selector: '.staff-member-starts-at-field')
    end

    def date_of_birth_field
      @date_of_birth_field ||= DatePickerField.new(self, selector: '.staff-member-date-of-birth-field')
    end

    def name_form
      @name_form ||= NameForm.new(self)
    end

    def address_form
      @address_form ||= AddressForm.new(self)
    end

    def scope
      page.find('.staff-member-form')
    end
  end
end
