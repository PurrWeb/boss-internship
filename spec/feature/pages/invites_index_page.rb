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
      react_app_div
    end

    private
    def react_app_div
      page.find('div[data-react-class="InvitesApp"]')
    end
  end
end
