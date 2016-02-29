module PageObject
  class CreateStaffMemberFromUserPage < Page
    def initialize(user)
      @user = user
      super()
    end

    def surf_to
      visit(url_helpers.new_staff_member_user_path(user))
    end

    def form
      @form ||= CreateStaffMemberFromUserForm.new(user: user, parent: self)
    end

    def assert_on_correct_page
      find('.create-staff-member-user-page')
    end

    private
    attr_reader :user
  end
end
