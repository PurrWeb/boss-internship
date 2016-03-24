module PageObject
  class StaffMemberShowPage < Page
    def initialize(staff_member)
      @staff_member = staff_member
      super()
    end
    attr_reader :staff_member
    include FlashHelpers

    def surf_to
      visit(url_helpers.staff_member_path(staff_member))
    end

    page_action :ensure_no_associated_user_message_displayed do
      expect(
        find(detail_section_selector_for(:user)).text
      ).to eq('No assocaited user')
    end

    page_action :click_view_user_button do
      find('.view-user-button.btn').click
    end

    page_action :ensure_details_displayed_for do |staff_member|
      expect(find(detail_section_selector_for(:venue)).text).to eq(staff_member.venue.name)
      expect(find(detail_section_selector_for(:name)).text).to eq(staff_member.full_name.titlecase)
      expect(find(detail_section_selector_for(:status)).text).to eq(staff_member_status_message(staff_member))
      expect(find(detail_section_selector_for(:gender)).text).to eq(staff_member.gender.titlecase)
      expect(find(detail_section_selector_for(:email)).text).to eq(staff_member.email)
      expect(find(detail_section_selector_for(:phone_number)).text).to eq(staff_member.phone_number)
      expect(find(detail_section_selector_for(:date_of_birth)).text).to eq(staff_member.date_of_birth.to_date.to_s.strip)
      expect(find(detail_section_selector_for(:national_insurance_number)).text).to eq(staff_member.national_insurance_number)
      expect(find(detail_section_selector_for(:staff_type)).text).to eq(staff_member.staff_type.name.titleize)
      expect(find(detail_section_selector_for(:address_1)).text).to eq(staff_member.address.address_1)
      expect(find(detail_section_selector_for(:address_2)).text).to eq(staff_member.address.address_2)
      expect(find(detail_section_selector_for(:address_3)).text).to eq(staff_member.address.address_3)
      expect(find(detail_section_selector_for(:address_4)).text).to eq(staff_member.address.address_4)
      expect(find(detail_section_selector_for(:region)).text).to eq(staff_member.address.region)
      expect(find(detail_section_selector_for(:postcode)).text).to eq(staff_member.address.postcode)
      expect(find(detail_section_selector_for(:day_preference)).text).to eq(staff_member.day_perference_note || 'Not specified')
      expect(find(detail_section_selector_for(:hour_preference)).text).to eq(staff_member.hours_preference_note || 'Not specified')
      expect(find(detail_section_selector_for(:start_date)).text).to eq(staff_member.starts_at.to_s(:human_date))
    end

    page_action :ensure_avatar_image_displayed do |image_url:|
      image = find('img.avatar-image')
      expect(image['src']).to eq(image_url)
    end

    page_action :click_edit_employment_details_button do
      button = find('a.btn.staff-member-edit-employment-details-button')
      button.click
    end

    page_action :click_edit_personal_details_button do
      button = find('a.btn.staff-member-edit-personal-details-button')
      button.click
    end

    def assert_on_correct_page
      expect(find('main h1').text).to eq(staff_member.full_name.titlecase)
    end

    private
    def ensure_name_displayed_for(staff_member)
      expect(find(detail_section_selector_for(:name)).text).to eq(staff_member.full_name.titlecase)
    end

    def detail_section_selector_for(detail)
      ".show-page-detail[data-detail=\"#{detail.to_s.gsub('_', '-')}\"]"
    end

    def staff_member_status_message(staff_member)
      staff_member.enabled? ? 'Active' : 'Disabled'
    end
  end
end
