module PageObject
  class StaffMemberShowPage < Page
    def initialize(staff_member)
      @staff_member = staff_member
      super()
    end
    attr_reader :staff_member
    include FlashHelpers

    def surf_to
      visit(url_helpers.staff_member_path(staff_member))
    end

    def assert_on_correct_page
      expect(find('h1').text).to eq('Staff Member Show Placeholder')
    end
  end
end
