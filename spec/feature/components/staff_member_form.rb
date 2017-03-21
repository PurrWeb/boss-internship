require 'base64'

module PageObject
  class StaffMemberForm < Component
    def initialize(user:, parent:)
      @user = user
      super(parent)
    end

    page_action :fill_in_for do |staff_member|
      _upload_avatar_image
      if staff_member.master_venue.present?
        scope.select(staff_member.master_venue.name, from: 'staff-member-master-venue-select')
      end
      if staff_member.work_venues.length > 0
        staff_member.work_venues.map do |venue|
          scope.select(venue.name, from: 'staff-member-venues-select')
        end
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
      if staff_member.pay_rate.present? && staff_member.pay_rate.editable_by?(user)
        scope.select(PayRateControlRate.new(pay_rate: staff_member.pay_rate, user: user).name, from: 'Pay rate')
      end
    end

    page_action :upload_avatar_image do
      _upload_avatar_image
    end

    page_action :ensure_photo_displayed do
      scope.find('.boss2-avatar')
    end

    page_action :submit do
      click_button 'Submit'
    end

    def scope
      page.find('.staff-member-form')
    end

    private
    attr_reader :hidden_avatar_field_selector, :user

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

    def _upload_avatar_image
      hidden_avatar_field.set(base64_encoded_avatar_image)
    end

    def base64_encoded_avatar_image
      "data:image/jpg;base64," +
      Base64.encode64(
        File.open(TestImageHelper.arnie_face_path){ |io| io.read }
      )
    end

    def hidden_avatar_field
      scope.find("input[name=\"staff_member[avatar_base64]\"]", visible: false)
    end
  end
end
