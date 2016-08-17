module PageObject
  class FlaggedStaffMemberPage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.flagged_staff_members_path)
    end

    def staff_members_list
      @staff_members_list || FlaggedStaffMemberList.new(self)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def filter
      @filter ||= StaffMembersIndexFilter.new(self)
    end

    page_action :ensure_records_returned do |count|
      filter.ensure_records_returned(count)
    end

    page_action :ensure_no_staff_members_found do
      filter.ensure_records_returned(0)
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
