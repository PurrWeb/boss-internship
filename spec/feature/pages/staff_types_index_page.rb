module PageObject
  class StaffTypesIndexPage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.staff_types_path)
    end

    page_action :click_add_staff_type_button do
      find('a.boss-button', text: "Add Staff Type").click
    end

    page_action :ensure_staff_types_listed do |type_names:|
      list = find('.staff-types-list')
      Array(type_names).each do |name|
        expect(list.text).to include(name)
      end
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
      'Staff Types'
    end
  end
end
