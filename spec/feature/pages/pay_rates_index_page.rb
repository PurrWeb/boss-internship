module PageObject
  class PayRatesIndexPage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.pay_rates_path)
    end

    page_action :click_add_pay_rate_button do
      find('a.boss3-button', text: 'Add Rate').click
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
      'Pay Rates'
    end
  end
end
