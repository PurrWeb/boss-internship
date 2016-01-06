module PageObject
  class AcceptInvitePage < Page
    def initialize(invite)
      @invite = invite
      super()
    end
    attr_reader :invite

    def surf_to
      visit(url_helpers.accept_invite_path(invite.token))
    end

    page_action :ensure_sign_up_text_displayed do
      expect(page.text).to match('Please fill in the following details to complete the sign up process')
    end

    def user_form
      @user_form ||= UserForm.new(self)
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
    def page_heading
      page.find('main h1')
    end

    def expected_page_heading_text
      'Accept Invite'
    end
  end
end
