module PageObject
  class ResetPasswordPage < Page
    include FlashHelpers

    def initialize(token)
      @token  = token
      super()
    end
    attr_reader :token

    def surf_to
      visit(url_helpers.edit_user_password_path(reset_password_token: token))
    end

    page_action :change_password_to do |new_password|
      fill_in('New Password', with: new_password)
      fill_in('Confirm Password', with: new_password)
      click_button('Change my password')
    end

    def assert_on_correct_page
      expect(find('h2.boss-modal-window__title').text).to  eq('Change Password')
    end
  end
end
