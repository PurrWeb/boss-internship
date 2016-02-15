module PageObject
  class HolidayReportsShowPage < Page
    def initialize(date:, venue:)
      @date = date
      @venue = venue
      super()
    end

    def surf_to
      visit(url_helpers.holiday_reports_path(date: date, venue: venue))
    end

    def assert_on_correct_page
      expect(page).
        to have_selector("#holiday-report-show-page[data-date='#{date}'][data-venue'#{venue.id}']")
    end

    attr_reader :date, :venue
  end
end
