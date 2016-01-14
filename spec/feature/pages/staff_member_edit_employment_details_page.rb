module PageObject
  class StaffMemberEditEmploymentDetailsPage < Page
    def initialize(staff_member)
      @staff_member = staff_member
      super()
    end
    attr_reader :staff_member
    include FlashHelpers

    def surf_to
      visit(url_helpers.edit_employment_details_staff_member_path(staff_member))
    end

    def assert_on_correct_page
      expect(page).to have_selector("#staff-member-edit-employment-details-page[data-staff-member-id='#{staff_member.id}']")
    end
  end
end
