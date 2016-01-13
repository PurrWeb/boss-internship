module PageObject
  class UserShowPage < Page
    def initialize(user)
      @user = user
      super()
    end
    attr_reader :user

    include FlashHelpers

    def surf_to
      visit(url_helpers.user_path(user))
    end

    page_action :click_edit_personal_details_button do
      button = find('a.btn.user-edit-personal-details-button')
      button.click
    end

    page_action :ensure_no_associated_staff_member_message_displayed do
      expect(
        find(detail_section_selector_for(:staff_member)).text
      ).to eq('No assocaited staff member')
    end

    page_action :click_view_staff_member_button do
      find('.view-staff-member-button.btn').click
    end

    page_action :ensure_details_displayed_for do |user|
      expect(find(detail_section_selector_for(:name)).text).to eq(user.full_name)
      expect(find(detail_section_selector_for(:email)).text).to eq(user.email)
      expect(find(detail_section_selector_for(:status)).text).to eq(user.status)
      expect(find(detail_section_selector_for(:role)).text).to eq(user.role.titleize)
    end

    def assert_on_correct_page
      expect(find('main h1').text).to eq(user.full_name)
    end

    private
    def ensure_name_displayed_for(user)
      expect(find(detail_section_selector_for(:name)).text).to eq(user.full_name)
    end

    def detail_section_selector_for(detail)
      ".show-page-detail[data-detail=\"#{detail.to_s.gsub('_', '-')}\"]"
    end
  end
end
