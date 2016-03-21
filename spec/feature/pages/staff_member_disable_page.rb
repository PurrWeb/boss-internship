module PageObject
  class StaffMemberDisablePage < Page
    def initialize(staff_member)
      @staff_member = staff_member
      super()
    end

    def surf_to
      visit(url_helpers.disable_staff_member_path(staff_member))
    end

    page_action :ensure_user_disable_warning_message_displayed do
      expect(page).to have_selector(user_disable_warning_message_selector)
    end

    page_action :ensure_user_disable_warning_message_not_displayed do
      expect(page).to_not have_selector(user_disable_warning_message_selector)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def assert_on_correct_page
      expect(page_heading).to(
        have_text(expected_page_heading_text),
        "expected page heading to have test '#{expected_page_heading_text}' got '#{page_heading.text}'"
      )
    end

    private
    attr_reader :staff_member

    def page_heading
      page.find('main h1')
    end

    def expected_page_heading_text
      'Disable Staff Member'
    end

    def user_disable_warning_message_selector
      '.user-disable-warning'
    end
  end
end
