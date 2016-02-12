module PageObject
  class HolidayReportsShowPage < Page
    def initialize(date)
      @date = date
      super()
    end

    def surf_to
      visit(url_helpers.holiday_report_path(date))
    end

    def assert_on_correct_page
      expect(page).
        to have_selector("#holiday-report-show-page[data-date='#{date}']")
    end

    attr_reader :date
  end
end
