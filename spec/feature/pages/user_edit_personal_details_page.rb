module PageObject
  class UserEditPersonalDetailsPage < Page
    def initialize(user)
      @user = user
      super()
    end
    attr_reader :user

    include FlashHelpers

    def form
      @form ||= UserPersonalDetailsForm.new(self)
    end

    def surf_to
      visit(url_helpers.edit_personal_details_user_path(user))
    end

    def assert_on_correct_page
      expect(page_heading.text).to eq("Edit Personal Details")
    end

    private
    def page_heading
      find('h1')
    end
  end
end
