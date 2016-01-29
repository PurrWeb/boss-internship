module PageObject
  class UserEditAccessDetailsPage < Page
    def initialize(user)
      @user = user
      super()
    end
    attr_reader :user

    include FlashHelpers

    page_action :ensure_role_displayed do |role|
      expect(find("dd[data-detail=\"role\"]").text).to eq(role.titleize)
    end

    def form
      @form ||= UserAccessDetailsForm.new(self)
    end

    def surf_to
      visit(url_helpers.edit_access_details_user_path(user))
    end

    def assert_on_correct_page
      expect(page_heading.text).to eq("Edit Access Details")
    end

    private
    def page_heading
      find('h1')
    end
  end
end
