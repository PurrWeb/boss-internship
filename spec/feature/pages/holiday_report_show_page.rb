module PageObject
  class HolidayReportsShowPage < Page
    FORMATS = [:html, :csv]

    def initialize(date:, venue:, format: :html)
      @date = date
      @venue = venue
      @format = normalise_format(format)
      super()
    end

    def surf_to
      params = {
        date: UIRotaDate.format(date),
        venue: venue.id
      }

      if format == :csv
        params[:format] = :csv
      end

      visit(url_helpers.holiday_reports_path(params))
    end

    page_action :download_csv do
      save_and_open_page
    end

    def normalise_format(format)
      if !FORMATS.include?(format)
        raise "supplied format :#{format} unsupported"
      end
      format
    end

    def assert_on_correct_page
      expect(page).to have_selector("#holiday-report-show-page")
    end

    attr_reader :date, :venue, :format
  end
end
