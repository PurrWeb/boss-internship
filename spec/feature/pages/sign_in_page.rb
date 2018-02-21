module PageObject
  class SignInPage < Page
    def surf_to
      visit(url_helpers.new_user_session_path)
    end

    def navigation
      NavigationBar.new(self)
    end

    page_action :sign_in do |email:, password:|
      fill_in('Email', with: email)
      fill_in('Password', with: password)
      click_button('Sign in')
    end

    page_action :click_forgotten_password_link do
      click_link('Forgot your password?')
    end

    page_action :ensure_flash_error_message_displayed do |expected_message|
      message_tag = page.find('.boss-modal-window__alert .boss-alert__text')
      expect(message_tag.text).to eq(expected_message)
    end

    page_action :ensure_flash_notice_message_displayed do |expected_message|
      message_tag = page.find('.boss-alert_role_confirm .boss-alert__text')
      expect(message_tag.text).to eq(expected_message)
    end

    def assert_on_correct_page
      expect(page_heading).to(
        have_text(expected_page_heading_text),
        "Expected page header to contain '#{expected_page_heading_text}' got '#{page_heading.text}'"
      )
    end

    private
    def page_heading
      page.find('.boss-modal-window__title')
    end

    def expected_page_heading_text
      'Sign In'
    end
  end
end
