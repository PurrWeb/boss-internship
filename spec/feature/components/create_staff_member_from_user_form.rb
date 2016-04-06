module PageObject
  class CreateStaffMemberFromUserForm < Component
    def initialize(user:, parent:)
      @user = user
      super(parent)
    end
    attr_reader :user

    page_action :fill_in_for do |staff_member|
      _upload_avatar_image
      if staff_member.venues.length > 0
        staff_member.venues.each do |venue|
          scope.select(venue.name, from: 'staff-member-venues-select')
        end
      end
      scope.select(staff_member.gender.titleize, from: 'Gender')
      scope.fill_in('National insurance number', with: staff_member.national_insurance_number)
      scope.select(staff_member.staff_type.name.titleize, from: 'Staff type')
      scope.fill_in('Pin code', with: staff_member.pin_code)
      scope.fill_in('Phone number', with: staff_member.phone_number)
      date_of_birth_field.fill_in_date(staff_member.date_of_birth)
      address_form.fill_in_for(staff_member.address)
      starts_at_field.fill_in_date(staff_member.starts_at)
      if staff_member.pay_rate.present?
        scope.select(
          PayRateControlRate.new(
            pay_rate: staff_member.pay_rate,
            user: user
          ).name,
          from: 'Pay rate'
        )
      end
    end

    page_action :submit do
      click_button 'Submit'
    end

    def starts_at_field
      @starts_at_field ||= DatePickerField.new(
        self,
        selector: '.staff-member-starts-at-field'
      )
    end

    def date_of_birth_field
      @date_of_birth_field ||= DatePickerField.new(
        self,
        selector: '.staff-member-date-of-birth-field'
      )
    end

    def address_form
      @address_form ||= AddressForm.new(self)
    end

    def scope
      find('.create-staff-member-from-user-form')
    end

    def _upload_avatar_image
      hidden_avatar_field.set(
        "data:image/jpg;base64," +
        Base64.encode64(
          File.open(TestImageHelper.arnie_face_path){ |io| io.read }
        )
      )
    end

    def hidden_avatar_field
      scope.find("input[name=\"staff_member[avatar_base64]\"]", visible: false)
    end
  end
end
