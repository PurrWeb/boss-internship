module PageObject
  class UserDisablePage < Page
    def initialize(user)
      @user = user
      super()
    end

    def surf_to
      visit(url_helpers.disable_user_path(user))
    end

    page_action :ensure_staff_member_disable_warning_message_displayed do
      expect(page).to have_selector(staff_member_disable_warning_message_selector)
    end

    page_action :ensure_staff_member_disable_warning_message_not_displayed do
      expect(page).to_not have_selector(staff_member_disable_warning_message_selector)
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
    attr_reader :user

    def page_heading
      page.find('main h1')
    end

    def expected_page_heading_text
      'Disable User'
    end

    def staff_member_disable_warning_message_selector
      '.staff-member-disable-warning'
    end
  end
end
