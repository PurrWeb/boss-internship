module PageObject
  class StaffMemberEnablePage < Page
    def initialize(staff_member)
      @staff_member = staff_member
      super()
    end

    page_action :change_starts_at_date do |date:|
      scope.find('#staff_member_starts_at_1i').select(date.year)
      scope.find('#staff_member_starts_at_2i').select(date.strftime("%B"))
      scope.find('#staff_member_starts_at_3i').select(date.day)
    end

    page_action :submit_page do
      scope.click_button('Submit')
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
    attr_reader :staff_member

    def page_heading
      scope.find('h1')
    end

    def expected_page_heading_text
      "Enable #{staff_member.full_name.titlecase}"
    end

    def scope
      page.find('main')
    end
  end
end
