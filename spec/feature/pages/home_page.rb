module PageObject
  class HomePage < Page
    include FlashHelpers

    def surf_to
      visit('/')
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def assert_on_correct_page
      page_heading
    end

    private
    def page_heading
      page.find('.test-welcome-div')
    end
  end
end
