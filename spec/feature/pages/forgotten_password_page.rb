class ForgottenPasswordPage < PageObject::Page
  def surf_to
    visit(url_helpers.new_user_password_path)
  end

  page_action :request_reset_instructions_for do |user|
    fill_in('Email', with: user.email)
    click_button('Send me reset password instructions')
  end

  def navigation
    NavigationBar.new(self)
  end

  def assert_on_correct_page
    expect(page_heading).to(
      have_text(expected_page_heading_text),
      "Expected page header to contain '#{expected_page_heading_text}' got '#{page_heading.text}'"
    )
  end

  private
  def page_heading
    page.find('main h1')
  end

  def expected_page_heading_text
    'Forgot your password?'
  end
end
