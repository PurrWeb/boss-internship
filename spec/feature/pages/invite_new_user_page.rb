module PageObject
  class InviteNewUserPage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.new_invite_path)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def form
      @form ||= InviteForm.new(self)
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
      'Invite new user'
    end
  end
end
