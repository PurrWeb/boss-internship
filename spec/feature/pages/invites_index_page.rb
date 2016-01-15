module PageObject
  class InvitesIndexPage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.invites_path)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def filter
      @filter ||= InvitesIndexFilter.new(self)
    end

    page_action :click_invite_new_user_button do
      click_link('Invite new user')
    end

    def invites_table
      @invites_table ||= InvitesIndexTable.new(self)
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
      'Invites'
    end
  end
end