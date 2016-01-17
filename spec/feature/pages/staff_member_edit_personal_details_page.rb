module PageObject
  class StaffMemberEditPersonalDetailsPage < Page
    def initialize(staff_member)
      @staff_member = staff_member
      super()
    end
    attr_reader :staff_member
    include FlashHelpers

    def surf_to
      visit(url_helpers.edit_personal_details_staff_member_path(staff_member))
    end

    def form
      @form ||= StaffMemberPersonalDetailsForm.new(self)
    end

    def assert_on_correct_page
      expect(page).to have_selector("#staff-member-edit-personal-details-page[data-staff-member-id='#{staff_member.id}']")
    end
  end
end
