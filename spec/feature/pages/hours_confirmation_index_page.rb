module PageObject
  class HoursConfirmationIndexPage < Page
    def surf_to
      visit(url_helpers.hours_confirmation_index_path)
    end

    def assert_on_correct_page
      expect(page_heading).to(
        have_text(expected_page_heading_text),
        "expected page heading to have test '#{expected_page_heading_text}' got '#{page_heading.text}'"
      )
    end

    def page_heading
      page.find('main h1')
    end

    def expected_page_heading_text
      'Add Staff Member'
    end
  end
end

