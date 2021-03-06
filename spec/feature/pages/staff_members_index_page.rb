module PageObject
  class StaffMembersIndexPage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.staff_members_path)
    end

    page_action :click_add_staff_member_button do
      click_link 'Add Staff Member'
    end

    page_action :click_staff_types_button do
      click_link 'Staff Types'
    end

    page_action :ensure_record_displayed_for do |user|
      find(:css, ".staff-members-index-listing[data-staff-member-id=\"#{user.id}\"]")
    end

    def staff_members_table
      @staff_members_table || StaffMembersIndexTable.new(self)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def filter
      @filter ||= StaffMembersIndexFilter.new(self)
    end

    def assert_on_correct_page
      expect(page_heading).to(
        have_text(expected_page_heading_text),
        "expected page heading to have test '#{expected_page_heading_text}' got '#{page_heading.text}'"
      )
    end

    private
    def page_heading
      page.find('main h1')
    end

    def expected_page_heading_text
      'Staff Members'
    end
  end
end
