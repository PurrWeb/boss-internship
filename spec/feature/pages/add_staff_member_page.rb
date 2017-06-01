module PageObject
  class AddStaffMemberPage < Page
    def initialize(user:)
      @user = user
      super()
    end

    def surf_to
      visit(url_helpers.new_staff_member_path)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def form
      @form ||= StaffMemberForm.new(user: user, parent: self)
    end

    def assert_on_correct_page
      expect(page_heading).to be_present
    end

    def page_heading
      page.find('div[data-react-class="AddStaffMemberPageComponent"]')
    end

    private
    attr_reader :user
  end
end
