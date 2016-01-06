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
      scope.select(staff_member.date_of_birth.year, from: 'staff_member_date_of_birth_1i')
      scope.select(staff_member.date_of_birth.strftime("%B"), from: 'staff_member_date_of_birth_2i')
      scope.select(staff_member.date_of_birth.day, from: 'staff_member_date_of_birth_3i')
      address_form.fill_in_for(staff_member.address)
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
