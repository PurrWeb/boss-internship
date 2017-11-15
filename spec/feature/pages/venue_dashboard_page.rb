module PageObject
  class VenueDashboardPage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.venue_dashboard_path)
    end

    def assert_on_correct_page
      page_heading
    end

    private
    def page_heading
      page.find('div[data-react-class="VenueDashboardApp"]')
    end
  end
end
