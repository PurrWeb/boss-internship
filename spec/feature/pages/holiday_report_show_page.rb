module PageObject
  class HolidayReportsShowPage < Page
    def initialize(date:, venue:)
      @date = date
      @venue = venue
      super()
    end

    def surf_to
      visit(url_helpers.holiday_reports_path(date: UIRotaDate.format(date), venue: venue.id))
    end

    def assert_on_correct_page
      expect(page).to have_selector("#holiday-report-show-page")
    end

    attr_reader :date, :venue
  end
end
